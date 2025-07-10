function CurrentStatus({ percentage, volume, maxCapacity }) {
  const getStatusColor = () => {
    if (percentage < 20) return 'red';
    if (percentage < 50) return 'orange';
    return 'green';
  };
  
  return (
    <div className="status-container">
      <h2>Nivel atual</h2>
      <div className="status-display">
        <div className="water-percentage">
          <div 
            className="water-fill"
            style={{ 
              height: `${percentage}%`,
              backgroundColor: getStatusColor()
            }}
          ></div>
          <span>{percentage.toFixed(1)}%</span>
        </div>
        <div className="water-details">
          <p><strong>Volume atual:</strong> {volume.toFixed(1)} L</p>
          <p><strong>Capacidade máxima:</strong> {maxCapacity.toFixed(1)} L</p>
        </div>
      </div>
    </div>
  );
}

export default CurrentStatus;