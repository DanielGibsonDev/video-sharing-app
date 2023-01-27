import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import tw from 'twrnc';
import MainText from '../../components/MainText';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function MainModal({ isModalVisible, setIsModalVisible }) {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable onPress={() => setIsModalVisible(false)} style={tw`opacity-0 flex-1`} />
        <Pressable
          style={tw`h-2/5 w-full absolute bottom-0 bg-white justify-center items-center rounded-3xl`}
        >
          <MainText style={tw`text-black -mt-10 px-20 text-center`}>Text goes here</MainText>

          <Pressable
            onPress={() => setIsModalVisible(false)}
            style={tw`absolute right-2 top-0 p-3`}
          >
            <FontAwesome name="angle-down" size={32} color="black" />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
