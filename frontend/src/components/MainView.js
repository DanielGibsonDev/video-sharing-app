import React from 'react';
import tw from 'twrnc';
import { View } from 'react-native';

export default function MainView({ children, style }) {
  return <View style={tw.style('items-center pt-10', style)}>{children}</View>;
}
