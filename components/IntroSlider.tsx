/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import {View, Text, StyleSheet} from 'react-native';
import {observer} from 'mobx-react';
import UIStore from '../stores/UIStore';
import {useContext} from 'react';
import settings from '../libs/settings.json';

import Svg1 from './intro/Slide1';
import Svg2 from './intro/Slide2';
import Svg3 from './intro/Slide3';

import {TextStyle} from 'react-native';

function getSlides() {
  return [
    {
      key: '1',
      title: 'Artikel lernen mit Articulus',
      text: 'Verwende Der, Die, Das korrekt und sicher mit Articulus',
      svg: () => <Svg1 />,
      backgroundColor: 'lightgrey',
    },
    {
      key: '2',
      title: 'Sprich die Artikel um sie dir einzuprägen',
      text: 'Sprich einfach den Artikel für jedes Wort und lerne freihändig',
      svg: () => <Svg2 />,
      backgroundColor: 'lightgrey',
    },
    {
      key: '3',
      title: 'Verbessere deine Deutschkenntnisse',
      text: 'Mit der Zeit perfektionierst du den Gebrauch von Artikeln',
      svg: () => <Svg3 />,
      backgroundColor: 'lightgrey',
    },
  ];
}

const renderItem = ({item, index}) => {
  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 10,
      flexDirection: 'column',
    },
    titleText: {
      fontWeight: 'bold',
      fontSize: 30,
      marginBottom: 10,
      textAlign: 'center',
      marginTop: 80,
    },
    descriptionText: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
      marginBottom: 100,
    },
  });

  return (
    <View style={[styles.wrapper, {backgroundColor: item.backgroundColor}]}>
      <Text style={styles.titleText}>{item.title}</Text>
      <View
        style={{
          flex: 1,
          alignSelf: 'stretch',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {item.svg(index)}
      </View>
      <Text style={styles.descriptionText}>{item.text}</Text>
    </View>
  );
};

function IntroSlider() {
  const uiStore = useContext(UIStore);

  const styleSliderButton: TextStyle = {
    fontSize: 20,
    marginRight: 10,
    marginVertical: 9,
    color: settings.colors.primary.dark,
    alignSelf: 'flex-end',
  };
  const renderNextButton = () => <Text style={styleSliderButton}>Weiter</Text>;
  const renderDoneButton = () => <Text style={styleSliderButton}>Fertig</Text>;
  return (
    <AppIntroSlider
      dotStyle={{backgroundColor: settings.colors.secondary.light}}
      activeDotStyle={{backgroundColor: settings.colors.primary.normal}}
      renderItem={renderItem}
      data={getSlides()}
      onDone={uiStore.hideIntro}
      showNextButton
      showDoneButton
      renderNextButton={renderNextButton}
      renderDoneButton={renderDoneButton}
    />
  );
}

export default observer(IntroSlider);
