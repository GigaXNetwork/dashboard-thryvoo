import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import SpinList from './SpinList';

const Spinning = () => {
  const [spinData, setSpinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSpinId, setNewSpinId] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);

  // Fetch spin data from API
  useEffect(() => {
    const fetchSpinData = async () => {
      try {
        setLoading(true);
        const token = Cookies.get('authToken');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/spin/my-spins`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                credentials: 'include'
            });
        const data = await response.json();
        console.log(data);
        
        
        if (data.status === 'success') {
          setSpinData(data.data.spin || []);
        } else {
          setError(data.message || 'Failed to fetch spin data');
        }
      } catch (err) {
        setError('Network error: Could not fetch spin data');
      } finally {
        setLoading(false);
      }
    };

    fetchSpinData();
  }, []);

  // Add a new spin
  const handleAddSpin = () => {
    if (!newSpinId.trim()) {
      setError('Please enter a valid spin ID');
      return;
    }
    
    if (spinData.spins.length >= 5) {
      setError('Maximum limit of 5 spins reached');
      return;
    }
    
    if (spinData.spins.includes(newSpinId)) {
      setError('This spin ID already exists');
      return;
    }
    
    setSpinData({
      ...spinData,
      spins: [...spinData.spins, newSpinId]
    });
    
    setNewSpinId('');
    setError(null);
  };

  // Remove a spin
  const handleRemoveSpin = (spinId) => {
    if (spinData.spins.length <= 1) {
      setError('Minimum of 1 spin required');
      return;
    }
    
    setSpinData({
      ...spinData,
      spins: spinData.spins.filter(id => id !== spinId)
    });
    
    setError(null);
  };

  // Simulate spinning the wheel
  const handleSpin = () => {
    if (!spinData.spins.length) {
      setError('No spins available');
      return;
    }
    
    setIsSpinning(true);
    setError(null);
    
    // Simulate spinning animation
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * spinData.spins.length);
      setSpinResult(spinData.spins[randomIndex]);
      setIsSpinning(false);
    }, 3000);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render setup UI if no data found
  if (!spinData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Setup Spins</h2>
          <p className="text-gray-600 mb-6">No spin data found. Please set up your spins to get started.</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200">
            Setup Spins
          </button>
        </div>
      </div>
    );
  }
return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Spinning Management</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Spin list */}
          <div className="lg:w-1/2">
            <SpinList spins={spinData.spins} />
          </div>
          
          {/* Right side - Spinning wheel */}
          <div className="lg:w-1/2 bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Spinning Wheel</h2>
            
            <div className="relative w-64 h-64 mb-6">
              <div 
                className={`absolute inset-0 rounded-full border-4 border-blue-300 bg-white flex items-center justify-center ${isSpinning ? 'animate-spin' : ''}`}
                style={{ 
                  transition: 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  animation: isSpinning ? 'spin 3s ease-out' : 'none'
                }}
              >
                <div className="w-4 h-4 bg-red-500 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                
                {spinData.spins.map((spin, index) => {
                  const angle = (360 / spinData.spins.length) * index;
                  const colorClass = `hsl(${index * (360 / spinData.spins.length)}, 70%, 65%)`;
                  return (
                    <div 
                      key={index}
                      className="absolute top-0 left-1/2 w-32 h-1 transform origin-bottom"
                      style={{ transform: `rotate(${angle}deg)` }}
                    >
                      <div 
                        className="w-16 h-1"
                        style={{ backgroundColor: colorClass }}
                      ></div>
                    </div>
                  );
                })}
                
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  Spin
                </div>
              </div>
              
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-10 bg-red-600 rounded-t-lg"></div>
              </div>
            </div>
            
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isSpinning ? 'Spinning...' : 'Spin Now'}
            </button>
            
            {spinResult && !isSpinning && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg text-center w-full">
                <p className="text-blue-800 font-semibold">Congratulations! You won:</p>
                <div className="flex items-center justify-center mt-2">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {spinResult.discountType ? (
                      DiscountIcons[spinResult.discountType] ? 
                      DiscountIcons[spinResult.discountType]() : 
                      DiscountIcons.default()
                    ) : (
                      DiscountIcons.default()
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-medium text-blue-900">{spinResult.presetName}</div>
                    <div className="text-sm text-blue-700">
                      {spinResult.discountType === 'percentage' ? `${spinResult.discountAmount}% off` : ''}
                      {spinResult.discountType === 'fixed' ? `$${spinResult.discountAmount} off` : ''}
                      {spinResult.discountType === 'free' ? 'FREE offer' : ''}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-blue-600">
                  Expires: {spinResult.expiresAt ? new Date(spinResult.expiresAt).toLocaleDateString() : 'No expiration'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(1080deg); }
        }
      `}</style>
    </div>
  );
};

export default Spinning;