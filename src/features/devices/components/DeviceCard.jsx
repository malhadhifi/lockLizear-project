const DeviceCard = ({ device }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h4 className="font-semibold">{device.device_name}</h4>
      <p className="text-sm text-gray-600">{device.device_type}</p>
    </div>
  );
};

export default DeviceCard;
