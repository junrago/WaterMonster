// styles/common.js
import { StyleSheet, Dimensions } from 'react-native';
import colors from './colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: screenWidth * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: screenWidth * 0.045, 
    fontFamily: 'MPLUSRounded1c-Bold',
    textAlign: 'center',
  },

  motalText: {
    color: colors.text,
    fontSize: screenWidth * 0.045,
    fontFamily: 'MPLUSRounded1c-Bold',
    textAlign: 'center',
  },
  buttonTextmini: {
    color: '#fff',
    fontSize: screenWidth * 0.03, 
    fontFamily: 'MPLUSRounded1c-Bold',
    textAlign: 'center',
  },
  buttonTextminib: {
    fontSize: screenWidth * 0.03, 
    fontFamily: 'MPLUSRounded1c-Bold',
    textAlign: 'center',
  },
  buttonTextminib: {
    fontSize: screenWidth * 0.03,
    fontFamily: 'MPLUSRounded1c-Bold',
    textAlign: 'center',
  },
  text: {
    color: '#3c5d8f',
    fontSize: screenWidth * 0.045,
    fontFamily: 'MPLUSRounded1c-Bold',
  },
  textshop: {
    color: '#3c5d8f',
    fontSize: screenWidth * 0.035,
    fontFamily: 'MPLUSRounded1c-Bold',
  },
  
  textw: {
    color: '#ffffffff',
    fontSize: screenWidth * 0.045,
    fontFamily: 'MPLUSRounded1c-Bold',
  },
  boldText: {
    color: '#3c5d8f',
    fontSize: screenWidth * 0.045,
    fontFamily: 'MPLUSRounded1c-Bold',
  },
  remainingText: {
    marginTop: screenHeight * 0.045, 
    color: '#fff',
    fontSize: screenWidth * 0.045,
    fontFamily: 'MPLUSRounded1c-Bold',
    textAlign: 'center',
  },
  remainingTextb: {
    marginTop: screenHeight * 0.01, 
    color: '#fff',
    fontSize: screenWidth * 0.045,
    fontFamily: 'MPLUSRounded1c-Bold',
    textAlign: 'center',
  },
  normalText: {
    fontSize: screenWidth * 0.045,
    color: '#fff',
  },
  highlightText: {
    marginTop: screenHeight * 0.028, 
    color: '#fff',
    fontSize: screenWidth * 0.055,
    fontFamily: 'MPLUSRounded1c-Bold',
  },
  mlText: {
    fontSize: screenWidth * 0.04,
    color: '#fff',
  },
});
