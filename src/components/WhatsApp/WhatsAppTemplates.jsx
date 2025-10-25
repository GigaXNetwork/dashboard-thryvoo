import React, { useEffect, useState } from 'react';
import RegistrationInfo from './RegistrationInfo';
import { getAuthToken } from '../../Context/apiService';

function WhatsAppTemplates() {
  const [templates, setTemplates] = useState([]);
  const [registration, setRegistration] = useState();
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/whatsapp/getTemplates`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getAuthToken(),
          },
        });
        const data = await res.json();
        if (data.status === 'success') {
          setTemplates(data.templates?.data || []);
          setRegistration(data.registration)
        }
      } catch (err) {
        console.error('Fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);


  const extractComponent = (components, type) => {
    return components?.find((comp) => comp.type === type);
  };

  const renderStatusBadge = (status) => {
    const baseClass = 'inline-block px-2 py-1 text-xs rounded-full';
    switch (status) {
      case 'APPROVED':
        return <span className={`${baseClass} bg-green-100 text-green-700`}>Approved</span>;
      case 'PENDING':
        return <span className={`${baseClass} bg-yellow-100 text-yellow-700`}>Pending</span>;
      default:
        return <span className={`${baseClass} bg-gray-100 text-gray-600`}>{status}</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">WhatsApp Templates</h1>

      {loading ? (
        <div className="text-gray-500 py-10 text-center">Loading...</div>
      ) : (
        <>
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">

          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b">
              <tr>
                <th className="px-4 py-3">Template Name</th>
                <th className="px-4 py-3">Language</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">See More</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {templates.map((template) => {
                const body = extractComponent(template.components, 'BODY');
                const footer = extractComponent(template.components, 'FOOTER');
                const buttons = extractComponent(template.components, 'BUTTONS');
                const lang = template.language === 'en_US' ? 'English (US)' : 'English';

                return (
                  <React.Fragment key={template.id}>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-900">{template.name}</td>
                      <td className="px-4 py-3">{lang}</td>
                      <td className="px-4 py-3">{renderStatusBadge(template.status)}</td>
                      <td className="px-4 py-3">{template.category}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setExpandedRow(expandedRow === template.id ? null : template.id)}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          {expandedRow === template.id ? 'Hide' : 'See More'}
                        </button>
                      </td>
                    </tr>

                    {expandedRow === template.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={5} className="px-4 py-4 text-sm text-gray-700">
                          <div><strong>Body:</strong> {body?.text || '—'}</div>
                          {footer?.text && <div><strong>Footer:</strong> {footer.text}</div>}
                          {buttons?.buttons && buttons.buttons.length > 0 && (
                            <div>
                              <strong>Buttons:</strong>
                              <ul className="list-disc pl-5">
                                {buttons.buttons.map((btn, idx) => (
                                  <li key={idx}>
                                    {btn.text} ({btn.type})
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          <div className="p-4 text-sm text-gray-600 border-t">
            {templates.length} message templates shown (total active templates: {templates.length} of 250)
          </div>
        </div>
        </>
      )}
    </div>
  );
}

export default WhatsAppTemplates;
