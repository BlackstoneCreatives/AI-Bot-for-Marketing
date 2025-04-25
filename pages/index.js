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
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-2 text-gray-800">AI Campaign Builder</h1>
      <p className="mb-6 text-gray-600 text-center max-w-xl">
        Fill out a few key details about your client or nonprofit below. Our AI will instantly generate a full Google Ads campaign draft — including ad copy, keyword suggestions, and bidding strategy — tailored to their goals.
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-md space-y-4">
        <FormField label="Organization Name" name="orgName" value={form.orgName} handleChange={handleChange} />
        <FormField label="Website URL" name="website" value={form.website} handleChange={handleChange} />
        <FormField label="Campaign Goal (e.g., Donations, Awareness)" name="goal" value={form.goal} handleChange={handleChange} />
        <FormField label="Service Type (e.g., Animal Rescue, Education)" name="service" value={form.service} handleChange={handleChange} />
        <FormField label="Location Targeting (City, State, or Region)" name="location" value={form.location} handleChange={handleChange} />
        <FormField label="Monthly Budget (USD)" name="budget" value={form.budget} handleChange={handleChange} type="number" />
        <FormField label="Key Message or Offer" name="message" value={form.message} handleChange={handleChange} isTextArea />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full font-semibold"
          disabled={loading}
        >
          {loading ? 'Generating Campaign...' : 'Generate Campaign'}
        </button>
      </form>

      {output && (
        <div className="mt-10 w-full max-w-2xl bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">🎯 AI-Generated Campaign Output</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-auto max-h-[500px]">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}

function FormField({ label, name, value, handleChange, type = 'text', isTextArea = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {isTextArea ? (
        <textarea name={name} value={value} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" rows="3" required />
      ) : (
        <input type={type} name={name} value={value} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" required />
      )}
    </div>
  );
}