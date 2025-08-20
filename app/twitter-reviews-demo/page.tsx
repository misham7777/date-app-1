import TwitterReviews from '../../components/TwitterReviews';

export default function TwitterReviewsDemo() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          color: 'white', 
          textAlign: 'center', 
          marginBottom: '2rem',
          fontSize: '2.5rem',
          fontWeight: 'bold'
        }}>
          Twitter Reviews Demo
        </h1>
        
        <p style={{ 
          color: 'white', 
          textAlign: 'center', 
          marginBottom: '3rem',
          fontSize: '1.2rem',
          opacity: 0.9
        }}>
          This is how the Twitter Reviews section looks in your Next.js app
        </p>
        
        {/* Twitter Reviews Component */}
        <TwitterReviews />
        
        <div style={{ 
          marginTop: '3rem', 
          padding: '2rem', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '12px',
          color: 'white'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Integration Notes:</h2>
          <ul style={{ lineHeight: '1.6' }}>
            <li>✅ Images are served from the <code>/public</code> folder</li>
            <li>✅ CSS is modularized and scoped</li>
            <li>✅ Component is fully responsive</li>
            <li>✅ Includes accessibility features</li>
            <li>✅ Clickable tweets open in new tabs</li>
            <li>✅ Smooth animations and hover effects</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
