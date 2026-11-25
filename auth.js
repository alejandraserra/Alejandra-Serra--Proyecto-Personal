const config = window.UNLOOP_CONFIG || {};
const loginDialog = document.querySelector('#login-dialog');
const loginMessage = document.querySelector('#login-message');
const accountPanel = document.querySelector('#account-panel');
const accountName = document.querySelector('#account-name');
const signInLink = document.querySelector('#sign-in-link');

let supabase = null;
let currentUser = null;

function announce(message) {
  loginMessage.textContent = message;
}

function setAccount(user) {
  currentUser = user || null;
  if (currentUser) {
    const metadata = currentUser.user_metadata || {};
    accountName.textContent = metadata.full_name || metadata.name || currentUser.email?.split('@')[0] || 'melómana';
    signInLink.textContent = 'MI CUENTA';
    accountPanel.hidden = false;
    if (loginDialog.open) loginDialog.close();
  } else if (!window.UnloopSpotify?.isConnected()) {
    accountPanel.hidden = true;
    signInLink.textContent = 'INICIA SESIÓN';
  }
}

async function getClient() {
  if (supabase) return supabase;
  if (!config.supabaseUrl?.trim() || !config.supabaseAnonKey?.trim()) return null;
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  supabase = createClient(config.supabaseUrl.trim(), config.supabaseAnonKey.trim(), {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  const { data } = await supabase.auth.getSession();
  setAccount(data.session?.user || null);
  supabase.auth.onAuthStateChange((_event, session) => setAccount(session?.user || null));
  return supabase;
}

document.querySelector('#login-form').addEventListener('submit', async event => {
  event.preventDefault();
  const email = document.querySelector('#login-email').value.trim();
  const button = event.currentTarget.querySelector('[type="submit"]');
  button.disabled = true;
  try {
    const client = await getClient();
    if (!client) throw new Error('El acceso por correo necesita conectar el proyecto de autenticación de UNLOOP.');
    const { error } = await client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}${location.pathname}` }
    });
    if (error) throw error;
    announce('Te hemos enviado un enlace para entrar o crear tu cuenta. Revisa tu correo.');
  } catch (error) {
    announce(error.message || 'No se pudo iniciar sesión. Inténtalo de nuevo.');
  } finally {
    button.disabled = false;
  }
});

document.querySelectorAll('.social-login button').forEach(button => button.addEventListener('click', async () => {
  button.disabled = true;
  try {
    const client = await getClient();
    if (!client) throw new Error('Los accesos sociales necesitan configurar el proyecto de autenticación de UNLOOP.');
    const provider = button.dataset.provider === 'Instagram'
      ? (config.instagramAuthProvider || 'custom:instagram')
      : button.dataset.provider.toLowerCase();
    const { error } = await client.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${location.origin}${location.pathname}` }
    });
    if (error) throw error;
  } catch (error) {
    announce(error.message || `No se pudo iniciar sesión con ${button.dataset.provider}.`);
    button.disabled = false;
  }
}));

document.querySelector('#signup-button').addEventListener('click', () => {
  announce('Al continuar con tu correo recibirás un enlace seguro para entrar o crear tu cuenta.');
  document.querySelector('#login-email').focus();
});

document.querySelector('#connect-spotify-from-account').addEventListener('click', () => {
  loginMessage.textContent = '';
  loginDialog.showModal();
});

window.UnloopAuth = {
  isConnected: () => Boolean(currentUser),
  async logout() {
    const client = await getClient();
    if (!client) return;
    const { error } = await client.auth.signOut();
    if (error) announce(error.message);
  }
};

getClient().catch(error => announce(`No se pudo cargar el acceso de UNLOOP: ${error.message}`));
