import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Audio} from 'expo-av'
import { Button } from 'react-native-web';

export default function App() {
  const [recording, setRecording] = React.useState()
  const [recordings, setRecordings] = React.useState([])
  const [message, setMessage] = React.useState('')

  async function startRecording(){
    try{
      const permission = await Audio.requestPermissionsAsync()

      if(permission.status === 'granted'){
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilinceMode: true
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording)
      }else{
        setMessage("Please granted acces to mc")
      }
    }
    catch(err){
      console.log('Failed to start recording', err)
    }

  }

  async function stopRecording(){
    setRecording(undefined)
    await recording.stopAndUnloadAsync()

    let updatedRecordings = [...recordings]
    const {sound, status} = await recording.CreateNewLoadedSoundAsync()
    updatedRecordings.push({
      sound:sound,
      status:status,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI()
    });

    setRecordings(updatedRecordings)

  }

  function getDurationFormatted(millis){
    const minutes = millis / 1000 / 60
    const minutesDisplay = Math.floor(minutes)
    const seconds = Math.floor(minutes - minutesDisplay) * 60
    const SecondsDisplay = seconds < 10 ? `0${seconds}` : seconds

    return `${minutesDisplay}:${SecondsDisplay}`


  }

  function getRecordingLines(){
    return recordings.map((recordingLine, index)=>{
      return(
        <View key={index} style={styles.row}>
          <Text style={styles.fill}> Recording {index + 1} - {recordingLine.duration}</Text>
          <Button style={styles.button} onPress={()=> recordingLine.sound.replayAsync()} title="Play"></Button>
        </View>
      )
    })
  }
  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      <Button 
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress= {recording ? 'Stop Recording' : 'Start Recording'}
      
      
      />

      {getRecordingLines()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row:{
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'center'

  }, 
  fill:{
    flex: 1,
    margin: 16
  }, 
  button:{
    margin: 16
  }
});
