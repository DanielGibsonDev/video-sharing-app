import React from 'react';
import tw from 'twrnc';
import { Text } from 'react-native';

export default function MediumText({ children, style }) {
  return (
    <Text
      style={tw.style('text-black text-base text-center', style, {
        fontFamily: 'Inter_500Medium',
      })}
    >
      {children}
    </Text>
  );
}
