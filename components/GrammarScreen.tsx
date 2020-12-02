import React from 'react';
import {View, Text} from 'react-native';
import sharedStyles from '../styles/sharedStyles';

import MagicBook from './SVGs/MagicBook';
import {ScrollView} from 'react-native-gesture-handler';
import GrammarTabs from './GrammarTabs';

function GrammarScreen() {
  return (
    <ScrollView>
      <View style={sharedStyles.screen}>
        <Text style={sharedStyles.screenTitle}>Regeln</Text>
        <Text style={sharedStyles.screenSubTitle}>Der - Die - Das</Text>

        <View style={sharedStyles.screenHeaderIcon}>
          <MagicBook width={150} />
        </View>

        <View style={sharedStyles.screenContent}>
          <GrammarTabs />
        </View>
      </View>
    </ScrollView>
  );
}

export default GrammarScreen;
