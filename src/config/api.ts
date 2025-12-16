// API Configuration
// Change this URL to your PHP API location after uploading the php-api folder to your hosting

export const API_CONFIG = {
  // Base URL for your PHP API
  baseUrl: 'https://abdelelbakri.com/php-api',

  // Set to true when API is ready, false to use mock data
  useApi: false,
};

// API Endpoints
export const API_ENDPOINTS = {
  clients: `${API_CONFIG.baseUrl}/clients.php`,
  cases: `${API_CONFIG.baseUrl}/cases.php`,
  appointments: `${API_CONFIG.baseUrl}/appointments.php`,
  services: `${API_CONFIG.baseUrl}/services.php`,
  consultations: `${API_CONFIG.baseUrl}/consultations.php`,
  upload: `${API_CONFIG.baseUrl}/upload.php`,
  timeline: `${API_CONFIG.baseUrl}/timeline.php`,
  stats: `${API_CONFIG.baseUrl}/stats.php`,
  notifications: `${API_CONFIG.baseUrl}/notifications.php`,
  seed: `${API_CONFIG.baseUrl}/seed.php`,
};
