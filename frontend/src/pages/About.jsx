export const About = () => {
  return (
    <div className="max-w-lg mx-auto pt-10">
      <h1 className="text-2xl font-semibold mb-4">About</h1>
      <p className="mb-4">
        Welcome to our application! This app features a comprehensive
        authentication system to ensure secure access to user accounts.
      </p>
      <h2 className="text-xl font-semibold mb-2">Authentication Process</h2>
      <p className="mb-4">
        Our authentication system allows users to sign up, sign in, and sign in
        with Google. Here's a brief overview of each process:
      </p>
      <h3 className="text-lg font-semibold mb-2">Sign Up</h3>
      <p className="mb-4">
        To sign up, users provide a username, email, and password. The password
        must be at least 6 characters long. We validate the email format and
        check for existing usernames and email addresses to prevent duplicates.
        Passwords are securely hashed using bcrypt before being stored in the
        database.
      </p>
      <h3 className="text-lg font-semibold mb-2">Sign In</h3>
      <p className="mb-4">
        To sign in, users provide their email and password. The password is
        compared against the stored hashed password using bcrypt. If the
        credentials are correct, a JWT token is generated and sent to the user
        to maintain their authenticated session.
      </p>
      <h3 className="text-lg font-semibold mb-2">Sign In with Google</h3>
      <p className="mb-4">
        Users can also sign in with their Google accounts. We fetch the user's
        Google profile information and check if the email already exists in our
        database. If the user is new, a new account is created with a randomly
        generated password, which is hashed using bcrypt. The user is then
        authenticated and issued a JWT token.
      </p>
      <h3 className="text-lg font-semibold mb-2">Security Measures</h3>
      <p className="mb-4">
        We take security seriously. All passwords are hashed using bcrypt before
        storage, and JWT tokens are used to maintain user sessions securely.
        This ensures that user data is protected and that only authenticated
        users can access their accounts.
      </p>
      <p className="mb-4">
        Thank you for using our app! If you have any questions or need support,
        please contact our team.
      </p>
    </div>
  );
};
