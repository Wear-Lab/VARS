using System;
using System.Windows.Input;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using Xamarin.Essentials;
using Xamarin.Forms;
using Plugin.BLE;
using System.Diagnostics;
using Plugin.BLE.Abstractions;
using Plugin.BLE.Abstractions.Contracts;
using Plugin.BLE.Abstractions.Exceptions;
using System.Threading;
using System.Runtime.ConstrainedExecution;

namespace VARS.ViewModels
{
    public class ConnectViewModel : BaseViewModel
    {
        IBluetoothLE ble = CrossBluetoothLE.Current;
        IAdapter adapter = CrossBluetoothLE.Current.Adapter;
        private IDevice arduino;
        ConnectParameters cancellationToken = new ConnectParameters();


        /*
        GUID Format:
        0000XXYY-1212-EFDE-1523-785FEABCD123
        XX - Service ID
        YY - Characteristic ID
        Services should set their Characteristic ID to 00
        */

        Guid varsUUID = new Guid("00000100-1212-EFDE-1523-785FEABCD123");
        private IService varsServ;

        string angle = "0";
        Guid angleUUID = new Guid("00000101-1212-EFDE-1523-785FEABCD123");
        private ICharacteristic angleChar;
        
        string velocity = "0";
        Guid velocityUUID = new Guid("00000102-1212-EFDE-1523-785FEABCD123");
        private ICharacteristic velocityChar;

        public ConnectViewModel()
        {
            Title = "Connect";
            adapter.ScanMode = ScanMode.LowLatency;
            ble.StateChanged += (s, e) =>
            {
                Debug.WriteLine($"The Bluetooth has changed to {e.NewState}");
            };


            adapter.DeviceConnected += async (t, b) =>
            {
                arduino = b.Device;
                try
                {
                    Debug.WriteLine("Looking for service for " + arduino.Name + "...");
                    var servs = await arduino.GetServicesAsync();
                    foreach (var serv in servs)
                        Debug.WriteLine("Name:\t" + serv.Name + "\t\tId:" + serv.Id);

                    varsServ = await arduino.GetServiceAsync(varsUUID);
                    if (varsServ == null) { Debug.WriteLine("Failed for\t" + varsUUID.ToString()); return; }
                    Debug.WriteLine("Looking for characteristics for " + varsServ.Id + "...");

                    angleChar = await varsServ.GetCharacteristicAsync(angleUUID);
                    if (angleChar == null) { Debug.WriteLine("Failed for:\t" + angleUUID.ToString()); return; }
                    angleChar.ValueUpdated += async (s, a) =>
                    {
                        if (angleChar == null) { Debug.WriteLine("characteristic is null..."); return; }
                        Angle = System.Text.Encoding.ASCII.GetString(angleChar.Value);
                    };
                    await angleChar.StartUpdatesAsync();

                    velocityChar = await varsServ.GetCharacteristicAsync(velocityUUID);
                    if (velocityChar == null) { Debug.WriteLine("Failed for:\t" + velocityUUID.ToString()); return; }
                    velocityChar.ValueUpdated += async (s, a) =>
                    {
                        if (velocityChar == null) { Debug.WriteLine("characteristic is null..."); return; }
                        Velocity = System.Text.Encoding.ASCII.GetString(velocityChar.Value);
                    };
                    await velocityChar.StartUpdatesAsync();
                }
                catch (DeviceConnectionException e)
                {
                    Debug.WriteLine(e);
                }
            };

            adapter.DeviceDiscovered += (s, a) => {
                Debug.WriteLine("Name:" + a.Device.Name);
            };

            ConnectBluetoothCommand = new Command(async () => {
                var devs = adapter.GetSystemConnectedOrPairedDevices();
                Debug.WriteLine("Initiating scan...");
                foreach (var dev in devs)
                    Debug.WriteLine("Name" + dev.Name + "\t\tId:" + dev.Id);
                /*
                Modify this if connecting to a different Feather
                GUID Format:
                00000000-0000-0000-0000-AABBCCDDEEFF
                Change AABBCCDDEEFF to the MAC Address of your feather
                This can be usually seen in bluetooth settings, with format AA:BB:CC:DD:EE:FF
                */
                await adapter.ConnectToKnownDeviceAsync(new Guid("00000000-0000-0000-0000-dbc06708a345"), cancellationToken);
            });
        }

        // TODO: Figure out what this line do
        // public event PropertyChangedEventHandler PropertyChanged;
        public ICommand ChangeText { get; }
        public ICommand ConnectBluetoothCommand { get; }

        public string Angle
        {
            get { return angle; }
            set { SetProperty(ref angle, value); }
        }
        public string Velocity
        {
            get { return velocity; }
            set { SetProperty(ref velocity, value); }
        }

        bool SetProperty<T>(ref T storage, T value, [CallerMemberName] string propertyName = null)
        {
            if (Object.Equals(storage, value))
                return false;

            storage = value;
            OnPropertyChanged(propertyName);
            return true;
        }
    }
}