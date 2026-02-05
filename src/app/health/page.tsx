export default function HealthCheck() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'monospace',
      background: '#000',
      color: '#0f0',
      minHeight: '100vh'
    }}>
      <h1>✅ Next.js App is Working</h1>
      <p>Build Date: {new Date().toISOString()}</p>
      <p>Node Version: {process.version}</p>
      <p>Environment: {process.env.NODE_ENV}</p>
      <h2>Routes Available:</h2>
      <ul>
        <li><a href="/" style={{color: '#0ff'}}>/ (Home)</a></li>
        <li><a href="/login" style={{color: '#0ff'}}>/login</a></li>
        <li><a href="/signup" style={{color: '#0ff'}}>/signup</a></li>
        <li><a href="/dashboard" style={{color: '#0ff'}}>/dashboard</a></li>
        <li><a href="/health" style={{color: '#0ff'}}>/health (this page)</a></li>
      </ul>
    </div>
  );
}
