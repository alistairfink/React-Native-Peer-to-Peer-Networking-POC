# React Native Peer to Peer Networking POC

## Device Setup (Device App Will Communicate With) [1]
### Setup
1. ~~Install 'rng-tools'
```

```
2. Disable Classic Networking
```
$ sudo systemctl mask networking.service dhcpcd.service
$ sudo mv /etc/network/interfaces /etc/network/interfaces-old
$ sudo sed -i '1i resolvconf=NO' /etc/resolvconf.conf
```
3. Enable systemd-networkd
```
$ sudo systemctl enable systemd-networkd.service systemd-resolved.service
$ sudo ln -sf /run/systemd/resolve/resolv.conf /etc/resolv.conf
```
4. Create Direct Wifi Supplicant File Called ```/etc/wpa_supplicant/wpa_supplicant-wlan0.conf``` with contents below.
Note: Fill in country and device name. Device name must begin with "DIRECT-"
```
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=CA
device_name=DIRECT-RasPi1
p2p_go_ht40=1
```
5. Give proper permissions to ```wpa_supplicant-wlan0.conf``` and enable service.
```
$ sudo chmod 600 /etc/wpa_supplicant/wpa_supplicant-wlan0.conf
$ sudo systemctl disable wpa_supplicant.service
$ sudo systemctl enable wpa_supplicant@wlan0.service
```
6. Give device a static IP and enable a DHCP server on it. Create a file called ```/etc/systemd/network/12-p2p-wlan0.network``` with contents below.
```
[Match]
Name=p2p-wlan0-*
[Network]
Address=192.168.4.1/24
DHCPServer=yes
```
7. Reboot device.

### Usage
1. Confirm device was setup properly by running the command ```ls /var/run/wpa_supplicant1```. The following should show up.
```
p2p-dev-wlan0 wlan0
```
2. Start searching for devices.
```
$ wpa_cli -i p2p-dev-wlan0 p2p_find
```
3. Connect to device through app.
// TODO: Finish this.
4. List Peers to Find Device.
```
$ wpa_cli -i p2p-dev-wlan0 p2p_peers
```

5. Get details on a listed MAC address.
```
$ wpa_cli -i p2p-dev-wlan0 p2p_peer <MAC_ADDRESS>
```

6. Accept MAC Address
```
$ wpa_cli -ip2p-dev-wlan0 p2p_connect <MAC_ADDRESS> pbc go_intent=15
```

Note: These instructions were run on a raspberry pi running Raspbian. These steps may differ depending on hardware and distro.

## Sources
[1] https://raspberrypi.stackexchange.com/questions/94171/setting-up-wifi-direct-wifi-p2p-and-dhcp-server