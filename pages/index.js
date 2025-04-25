import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';

export default function AdCampaignBuilder() {
  const [form, setForm] = useState({
    orgName: '',
    website: '',
    goal: '',
    service: '',
    location: '',
    budget: '',
    message: ''
  });
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOutput('');

    const prompt = `Create a Google Ads campaign for a nonprofit called ${form.orgName}.
Website: ${form.website}
Their goal is to ${form.goal}, targeting ${form.location}.
Service Type: ${form.service}.
Monthly Budget: $${form.budget}.
Key Message: "${form.message}"
Return: Campaign name, 1-2 ad groups, keywords (with match types), 2 ad variations, suggested daily budget & bidding strategy.`;

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    setOutput(data.result || 'No response from AI');
    setLoading(false);
  };

  return (
    <div className="container py-5">
      <h1 className="mb-3">AI Campaign Builder</h1>
      <p className="mb-4 text-muted">
        Fill out a few key details about your client or nonprofit below. Our AI will instantly generate a full Google Ads campaign draft — including ad copy, keyword suggestions, and bidding strategy — tailored to their goals.
      </p>

      <form onSubmit={handleSubmit} className="mb-5">
        <FormField label="Organization Name" name="orgName" value={form.orgName} handleChange={handleChange} />
        <FormField label="Website URL" name="website" value={form.website} handleChange={handleChange} />
        <FormField label="Campaign Goal (e.g., Donations, Awareness)" name="goal" value={form.goal} handleChange={handleChange} />
        <FormField label="Service Type (e.g., Animal Rescue, Education)" name="service" value={form.service} handleChange={handleChange} />
        <FormField label="Location Targeting (City, State, or Region)" name="location" value={form.location} handleChange={handleChange} />
        <FormField label="Monthly Budget (USD)" name="budget" value={form.budget} handleChange={handleChange} type="number" />
        <FormField label="Key Message or Offer" name="message" value={form.message} handleChange={handleChange} isTextArea />

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Campaign'}
        </button>
      </form>

      {output && (
        <div className="card shadow-sm p-4">
          <h2 className="h5">🎯 AI-Generated Campaign Output</h2>
          <pre className="mt-3 text-muted">{output}</pre>
        </div>
      )}
    </div>
  );
}

function FormField({ label, name, value, handleChange, type = 'text', isTextArea = false }) {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">{label}</label>
      {isTextArea ? (
        <textarea id={name} name={name} value={value} onChange={handleChange} className="form-control" rows="3" required />
      ) : (
        <input type={type} id={name} name={name} value={value} onChange={handleChange} className="form-control" required />
      )}
    </div>
  );
}