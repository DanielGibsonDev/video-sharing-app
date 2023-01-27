import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import tw from 'twrnc';
import { Feather } from '@expo/vector-icons';

export default function MainModal({ children, styleHeight, isModalVisible, setIsModalVisible }) {
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
          style={tw`${styleHeight} w-full absolute bottom-0 bg-white pt-5 items-center rounded-3xl`}
        >
          {children}
          <Pressable
            onPress={() => setIsModalVisible(false)}
            style={tw`absolute right-0 top-0 p-5`}
          >
            <Feather name="x" size={28} color="black" />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
