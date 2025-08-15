import React, { useEffect, useState } from "react";

const Setting = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    referralCoin: 0,
    category: [],
    socialMediaRewards: {
      facebook: 0,
      instagram: 0,
      youtube: 0,
      others: 0,
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/settings");

        if (res.status === 404) {
          setSettings(null);
        } else if (res.ok) {
          const data = await res.json();
          setSettings(data.data);
        } else {
          console.error("Error fetching settings:", res.statusText);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("socialMediaRewards.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialMediaRewards: {
          ...prev.socialMediaRewards,
          [key]: Number(value),
        },
      }));
    } else if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        category: value.split(",").map((c) => c.trim()),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Settings created successfully!");
        window.location.reload();
      } else {
        console.error("Error creating settings:", await res.text());
      }
    } catch (err) {
      console.error("Error creating settings:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Settings</h1>

      {settings ? (
        <div>
          <h3>Referral Coin: {settings.referralCoin}</h3>
          <h3>Categories:</h3>
          <ul>
            {settings.category.map((cat, i) => (
              <li key={i}>{cat}</li>
            ))}
          </ul>
          <h3>Social Media Rewards:</h3>
          <ul>
            {Object.entries(settings.socialMediaRewards).map(([key, value]) => (
              <li key={key}>
                {key}: {value}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h3>Create Settings</h3>
          <input
            type="number"
            name="referralCoin"
            placeholder="Referral Coin"
            value={formData.referralCoin}
            onChange={handleChange}
          />
          <input
            type="text"
            name="category"
            placeholder="Categories (comma separated)"
            value={formData.category.join(", ")}
            onChange={handleChange}
          />
          <h4>Social Media Rewards</h4>
          {Object.keys(formData.socialMediaRewards).map((key) => (
            <input
              key={key}
              type="number"
              name={`socialMediaRewards.${key}`}
              placeholder={`${key} reward`}
              value={formData.socialMediaRewards[key]}
              onChange={handleChange}
            />
          ))}
          <br />
          <button onClick={handleCreate}>Create Setting</button>
        </div>
      )}
    </div>
  );
};

export default Setting;
