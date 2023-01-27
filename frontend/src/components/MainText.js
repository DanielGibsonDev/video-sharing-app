import React from 'react';
import tw from 'twrnc';
import { Text } from 'react-native';

export default function MainText({ children, style }) {
  return (
    <Text
      style={tw.style('text-white text-base text-center', style, {
        fontFamily: 'Inter_400Regular',
      })}
    >
      {children}
    </Text>
  );
}
