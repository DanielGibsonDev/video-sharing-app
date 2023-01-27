const Mux = require('@mux/mux-node');
const functions = require('firebase-functions');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const base64 = require('base64url');
const fetch = require('node-fetch');

// Firestore init
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

// Mux API tokens. Secrets defined in Firebase
const muxTokenId = defineSecret('MUX_TOKEN_ID');
const muxTokenSecret = defineSecret('MUX_TOKEN_SECRET_NEW');
const firebaseFunctionMux = functions.runWith({ secrets: [muxTokenId, muxTokenSecret] }).https;

const muxWebHookSigningSecret = defineSecret('MUX_WEBHOOK_SIGNING_SECRET');
const firebaseFunctionMuxWebHook = functions.runWith({ secrets: [muxWebHookSigningSecret] }).https;

const muxDataSigningKey = defineSecret('MUX_DATA_SIGNING_KEY');
const muxDataPrivateKey = defineSecret('MUX_DATA_PRIVATE_KEY');
const firebaseFunctionMuxData = functions.runWith({ secrets: [muxDataSigningKey, muxDataPrivateKey] }).https;

/*
 Firebase cloud function used for uploading a video file to Mux storage.
 First Mux will generate a signed Google Cloud Storage bucket URL which is returned
 to the frontend.
 Second the frontend will update the URL to include the video file URI into the body.
 Lastly Mux will automatically upload this to their storage.
 */
exports.generateSignedUrl = firebaseFunctionMux.onCall(async (data, context) => {
  const { Video } = new Mux(muxTokenId.value(), muxTokenSecret.value());

  try {
    const signedUploadUrl = await Video.Uploads.create({
      cors_origin: '*',
      new_asset_settings: {
        playback_policy: 'public',
      },
    });
    return signedUploadUrl;
  } catch (error) {
    functions.logger.error('failed to get generated URL -> ', error);
  }
});

/*
 Firebase cloud function used for listening to Mux video webhook.
 On any new Mux event (particularly changes to video upload statuses)
 it will send a POST request to this function. This function updates the database in response
 */
exports.muxWebHook = firebaseFunctionMuxWebHook.onRequest((req, res) => {
  // Had difficulty verifying the Mux signature - Skipped this for now.
  // Error: No signatures found matching the expected signature for payload.
  // const signature = req.headers['mux-signature'];
  // const signingSecret = muxWebHookSigningSecret.value();
  // const isValidSignature = Mux.Webhooks.verifyHeader(
  //     req.body,
  //     signature,
  //     signingSecret,
  // );
  // functions.logger.info('Successfully validated webhook signature ', isValidSignature);

  const body = req.body;
  if (body.type === 'video.asset.ready') {
    functions.logger.info('processing video asset status update... ');
    // eslint-disable-next-line camelcase
    const { upload_id, duration, playback_ids, status, id } = body.data;
    functions.logger.info('body data of request -> ', body.data);

    db.collection('videos').where('upload_id', '==', upload_id).get().then(
        (snapshot) => {
          if (snapshot.empty) {
            functions.logger.info('no video match found, skipping update');
            return null;
          }
          snapshot.docs[0].ref.update({
            duration,
            // eslint-disable-next-line camelcase
            playback_id: playback_ids[0].id,
            upload_status: status,
            mux_id: id,
          }).then(() => {
            functions.logger.info('successfully updated video asset');
            res.status(200).end();
          });
        },
    );
  }
});

/*
 Firebase cloud function used for fetching real-time view count on a video.
 Generates a JSON web token using a Mux Data private key and fetches data from stats.mux.com
 Takes in parameter of "playbackId" which is the playback id of a Mux video
 */
exports.getRealTimeViewCount = firebaseFunctionMuxData.onCall(async (data, context) => {
  if (!(typeof data.playbackId === 'string') || data.playbackId.length === 0) {
    throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be call with ' +
      'one argument "playbackId" containing the Mux Playback ID of the video',
    );
  }
  try {
    functions.logger.info('Generating JSON Web Token...');
    const keyId = muxDataSigningKey.value();
    const privateKey = base64.decode(muxDataPrivateKey.value());
    const playbackId = data.playbackId;
    const token = jwt.sign({
      sub: playbackId,
      aud: 'playback_id',
      exp: Date.now() + 6000,
      kid: keyId,
    },
    privateKey,
    { algorithm: 'RS256' });

    functions.logger.info('Success. Fetching real-time view count data...');
    const fetchRealTimeViewCount = await fetch(`https://stats.mux.com/counts?token=${token}`);
    const { data: realTimeViewCountData } = await fetchRealTimeViewCount.json();
    functions.logger.info('Success -> ', realTimeViewCountData);
    return realTimeViewCountData;
  } catch (error) {
    functions.logger.error('failed to fetch real-time view count -> ', error);
  }
});


/*
 Firebase cloud function used for fetching view counts on a video.
 Takes in parameter of "video_id" which is a Firebase ID of the video which
 happens to be the Video Title set in Mux.
 */
exports.getVideoViews = firebaseFunctionMux.onCall(async (data, context) => {
  // the data parameter is the argument passed in from the frontend which we expect to be the database ID of the video
  if (!(typeof data.video_id === 'string') || data.video_id.length === 0) {
    throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be call with ' +
      'one argument "video_id" containing the database ID of the video',
    );
  }
  try {
    const videoId = data.video_id;
    const { Data } = new Mux(muxTokenId.value(), muxTokenSecret.value());
    const viewCount = await Data.VideoViews.list({filters: [`video_title:${videoId}`], timeframe: ['30:days']});
    return viewCount;
  } catch (error) {
    functions.logger.error('failed to fetch video views data -> ', error);
  }
});


// Functions not in use

/*
 <Not currently in use.>
 Firebase cloud function used for fetching a video from Mux.com /video API.
 Uses Mux Node SKD Video.Uploads.get() which fetches a Direct Upload file.
 Takes in parameter of "videoAssetId" which is the asset ID for a Mux.com video
 */
exports.getDirectUpload = firebaseFunctionMux.onCall(async (data, context) => {
  const { Video } = new Mux(muxTokenId.value(), muxTokenSecret.value());

  const uploadId = data.uploadId;
  if (!(typeof uploadId === 'string') || uploadId.length === 0) {
    throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be call with ' +
      'one arguments "uploadId" containing the ID of the upload to view',
    );
  }

  return await Video.Uploads.get(uploadId).catch((error) =>
    functions.logger.error('failed to get video asset -> ', error),
  );
});


/*
 <Not currently in use.>
 Firebase cloud function used for fetching a video from Mux.com /video API.
 Uses Mux Node SKD Video.Assets.get() which fetches a video asset.
 Takes in parameter of "videoAssetId" which is the asset ID for a Mux.com video
 */
exports.getVideo = firebaseFunctionMux.onCall(async (data, context) => {
  const { Video } = new Mux(muxTokenId.value(), muxTokenSecret.value());

  const assetId = data.videoAssetId;
  if (!(typeof assetId === 'string') || assetId.length === 0) {
    throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be call with ' +
      'one arguments "videoAssetId" containing the url of the video to post',
    );
  }

  return await Video.Assets.get(assetId).catch((error) =>
    functions.logger.error('failed to get video asset -> ', error),
  );
});


/*
 <Not currently in use.>
 Firebase cloud function used for posting a video to Mux.com /video API.
 Uses Mux Node SDK Video.Assets.create() which uploads a video based on a URL.
 Takes in parameter of "videoUrl" which is a URL of a video file
 */
exports.postVideo = firebaseFunctionMux.onCall(async (data, context) => {
  const { Video } = new Mux(muxTokenId.value(), muxTokenSecret.value());

  const url = data.videoUrl;
  if (!(typeof url === 'string') || url.length === 0) {
    throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be call with ' +
      'one arguments "videoUrl" containing the url of the video to post',
    );
  }
  return await Video.Assets.create({
    input: url,
    playback_policy: 'public',
  }).catch((error) => functions.logger.error('failed to post video -> ', error));
});
