import React from 'react';
import tw from 'twrnc';
import { Pressable } from 'react-native';

export default function MainPressable({ children, style, onPress, disabled, hitSlop = 20 }) {
  return (
    <Pressable
      style={({ pressed }) =>
        tw.style('bg-white py-4 items-center my-8 w-4/5 rounded-full', style, {
          opacity: pressed ? 0.5 : 1,
        })
      }
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
    >
      {children}
    </Pressable>
  );
}
