import { useAuth } from './AuthProvider';
import { auth } from '../firebase';

const DebugAuth = () => {
  const { currentUser, loading } = useAuth();
  
  const firebaseConfigCheck = {
    apiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
    // Mostrar solo si existen
    apiKeyValue: import.meta.env.VITE_FIREBASE_API_KEY?.substring(0, 10) + '...',
    authDomainValue: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectIdValue: import.meta.env.VITE_FIREBASE_PROJECT_ID
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg text-sm">
      <h3 className="font-bold mb-2">Debug Auth Status</h3>
      <div className="space-y-1">
        <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
        <p><strong>Current User:</strong> {currentUser ? currentUser.email : 'null'}</p>
        <p><strong>Auth Instance:</strong> {auth ? 'initialized' : 'not initialized'}</p>
        <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
        
        <h4 className="font-semibold mt-2">Firebase Config:</h4>
        <div className="pl-2">
          <p>API Key: {firebaseConfigCheck.apiKey ? '✅' : '❌'} {firebaseConfigCheck.apiKeyValue}</p>
          <p>Auth Domain: {firebaseConfigCheck.authDomain ? '✅' : '❌'} {firebaseConfigCheck.authDomainValue}</p>
          <p>Project ID: {firebaseConfigCheck.projectId ? '✅' : '❌'} {firebaseConfigCheck.projectIdValue}</p>
        </div>
        
        <h4 className="font-semibold mt-2">localStorage:</h4>
        <p>Mock User: {localStorage.getItem('mockUser') ? '✅ Present' : '❌ Not found'}</p>
      </div>
    </div>
  );
};

export default DebugAuth;