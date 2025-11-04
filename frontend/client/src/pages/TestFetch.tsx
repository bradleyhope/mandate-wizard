import { useState, useEffect } from 'react';

export default function TestFetch() {
  const [results, setResults] = useState<any>({
    env: {},
    tests: [],
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    async function runDiagnostics() {
      const diagnostics: any = {
        env: {
          VITE_API_URL: import.meta.env.VITE_API_URL,
          MODE: import.meta.env.MODE,
          DEV: import.meta.env.DEV,
          PROD: import.meta.env.PROD,
        },
        tests: [],
        timestamp: new Date().toISOString()
      };

      // Test 1: Direct fetch to /api/recent-mandates (should be proxied)
      try {
        const start1 = Date.now();
        const response1 = await fetch('/api/recent-mandates', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const duration1 = Date.now() - start1;
        const data1 = await response1.json();
        
        diagnostics.tests.push({
          name: 'Test 1: Relative URL /api/recent-mandates (Vite Proxy)',
          status: response1.ok ? '✅ SUCCESS' : '❌ FAILED',
          url: '/api/recent-mandates',
          statusCode: response1.status,
          statusText: response1.statusText,
          duration: `${duration1}ms`,
          dataReceived: data1 ? `${JSON.stringify(data1).length} bytes` : 'none',
          cardCount: data1?.data?.cards?.length || 0,
          error: null
        });
      } catch (err) {
        diagnostics.tests.push({
          name: 'Test 1: Relative URL /api/recent-mandates (Vite Proxy)',
          status: '❌ FAILED',
          url: '/api/recent-mandates',
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : null
        });
      }

      // Test 2: Direct fetch to localhost:5000
      try {
        const start2 = Date.now();
        const response2 = await fetch('http://localhost:5000/api/recent-mandates', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const duration2 = Date.now() - start2;
        const data2 = await response2.json();
        
        diagnostics.tests.push({
          name: 'Test 2: Direct to localhost:5000',
          status: response2.ok ? '✅ SUCCESS' : '❌ FAILED',
          url: 'http://localhost:5000/api/recent-mandates',
          statusCode: response2.status,
          statusText: response2.statusText,
          duration: `${duration2}ms`,
          dataReceived: data2 ? `${JSON.stringify(data2).length} bytes` : 'none',
          cardCount: data2?.data?.cards?.length || 0,
          error: null
        });
      } catch (err) {
        diagnostics.tests.push({
          name: 'Test 2: Direct to localhost:5000',
          status: '❌ FAILED',
          url: 'http://localhost:5000/api/recent-mandates',
          error: err instanceof Error ? err.message : String(err),
          note: 'This is expected to fail due to CORS in browser'
        });
      }

      // Test 3: Using the API helper (same as Home.tsx)
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || '';
        const endpoint = `${API_BASE_URL}/api/recent-mandates`;
        
        const start3 = Date.now();
        const response3 = await fetch(endpoint, {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Email': localStorage.getItem('user_email') || '',
          },
        });
        const duration3 = Date.now() - start3;
        const data3 = await response3.json();
        
        diagnostics.tests.push({
          name: 'Test 3: Using API Helper (same as Home.tsx)',
          status: response3.ok ? '✅ SUCCESS' : '❌ FAILED',
          url: endpoint,
          computedUrl: endpoint === '/api/recent-mandates' ? 'Relative (will use proxy)' : 'Absolute',
          statusCode: response3.status,
          statusText: response3.statusText,
          duration: `${duration3}ms`,
          dataReceived: data3 ? `${JSON.stringify(data3).length} bytes` : 'none',
          cardCount: data3?.data?.cards?.length || 0,
          error: null
        });
      } catch (err) {
        const API_BASE_URL = import.meta.env.VITE_API_URL || '';
        const endpoint = `${API_BASE_URL}/api/recent-mandates`;
        
        diagnostics.tests.push({
          name: 'Test 3: Using API Helper (same as Home.tsx)',
          status: '❌ FAILED',
          url: endpoint,
          computedUrl: endpoint === '/api/recent-mandates' ? 'Relative (will use proxy)' : 'Absolute',
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : null
        });
      }

      setResults(diagnostics);
    }

    runDiagnostics();
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', background: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>🔍 API Diagnostics</h1>
      
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Environment Variables</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {Object.entries(results.env).map(([key, value]) => (
              <tr key={key} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>{key}</td>
                <td style={{ padding: '8px' }}>{String(value) || '(empty)'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {results.tests.map((test: any, idx: number) => (
        <div 
          key={idx}
          style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            borderLeft: `4px solid ${test.status.includes('SUCCESS') ? '#10b981' : '#ef4444'}`
          }}
        >
          <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>
            {test.status} {test.name}
          </h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <tbody>
              {Object.entries(test).filter(([key]) => key !== 'name' && key !== 'status').map(([key, value]) => (
                <tr key={key} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '6px', fontWeight: 'bold', width: '150px' }}>{key}</td>
                  <td style={{ padding: '6px', wordBreak: 'break-all' }}>
                    {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div style={{ background: '#fef3c7', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
        <strong>💡 What to look for:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Test 1 should succeed (uses Vite proxy)</li>
          <li>Test 2 may fail (CORS issue with direct localhost call)</li>
          <li>Test 3 should match Test 1 if VITE_API_URL is empty</li>
          <li>If all tests fail, the backend might not be running</li>
          <li>If Test 1 succeeds but Test 3 fails, there's an issue with the API helper configuration</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        Timestamp: {results.timestamp}
      </div>
    </div>
  );
}

