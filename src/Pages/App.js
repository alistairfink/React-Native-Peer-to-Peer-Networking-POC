import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  PermissionsAndroid,
  ToastAndroid,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AppStyle from '../Styles/AppStyle';
import {
  initialize,
  isSuccessfulInitialize,
  startDiscoveringPeers,
  stopDiscoveringPeers,
  unsubscribeFromPeersUpdates,
  unsubscribeFromConnectionInfoUpdates,
  subscribeOnConnectionInfoUpdates,
  subscribeOnPeersUpdates,
  connect,
  disconnect,
  createGroup,
  removeGroup,
  getAvailablePeers,
  sendFile,
  receiveFile,
  getConnectionInfo,
} from 'react-native-wifi-p2p';

function App() {
  const [Devices, setDevices] = useState([]);

  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: 'Access to wi-fi P2P mode',
        message: 'ACCESS_COARSE_LOCATION',
      },
    ).then(granted => {
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        ToastAndroid.show('Permission denied: p2p mode will not work', 1000);
      }
    });

    return () => {
      unsubscribeFromConnectionInfoUpdates(event =>
        console.log('unsubscribeFromConnectionInfoUpdates', event),
      );
      unsubscribeFromPeersUpdates(event =>
        console.log('unsubscribeFromPeersUpdates', event),
      );
    };
  }, []);

  const HandleNewPeers = peers => {
    ToastAndroid.show('New Peers', 1000);
    setDevices(peers);
  };

  const HandleNewInfo = (info, secondParam) => {
    ToastAndroid.show('New Info: ' + JSON.stringify(info), 1000);
  };

  const ConnectToDevice = device => {
    connect(device.deviceAddress).then(() =>
      ToastAndroid.show(`Successfully connected to ${device.deviceName}`, 1000),
    );
  };

  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={AppStyle.Outer}>
        <Text>Actions</Text>
        <TouchableOpacity
          style={AppStyle.OuterButton}
          onPress={() => {
            ToastAndroid.show('Setting Up P2P Communcation', 1000);
            initialize();
            isSuccessfulInitialize().then(status => {
              startDiscoveringPeers()
                .then(() => {
                  subscribeOnPeersUpdates(({devices}) =>
                    HandleNewPeers(devices),
                  );
                  subscribeOnConnectionInfoUpdates(HandleNewInfo);
                })
                .catch(err =>
                  ToastAndroid.show('Error: ' + err.toString(), 1000),
                );
            });
          }}>
          <Text>Easy Setup</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={AppStyle.OuterButton}
          onPress={() => {
            initialize();
            isSuccessfulInitialize().then(status =>
              ToastAndroid.show('Initialization Successful', 1000),
            );
          }}>
          <Text>1. Init</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={AppStyle.OuterButton}
          onPress={() => {
            startDiscoveringPeers()
              .then(() => ToastAndroid.show('Started Discovering Peers', 1000))
              .catch(err =>
                ToastAndroid.show('Error: ' + err.toString(), 1000),
              );
          }}>
          <Text>2. Discover Peers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={AppStyle.OuterButton}
          onPress={() => {
            ToastAndroid.show('Subscribing to Updates', 1000);
            subscribeOnPeersUpdates(({devices}) => HandleNewPeers(devices));
            subscribeOnConnectionInfoUpdates(HandleNewInfo);
          }}>
          <Text>3. Subscribe to Updates</Text>
        </TouchableOpacity>
      </ScrollView>
      <ScrollView style={AppStyle.Outer}>
        <Text>Devices (Tap Device to Connect)</Text>
        {Devices.map((el, i) => (
          <TouchableOpacity
            key={i}
            style={AppStyle.OuterButton}
            onPress={() => {
              ToastAndroid.show(`Connecting to ${el.deviceName}`, 1000);
            }}>
            <Text>{JSON.stringify(el)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
