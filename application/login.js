<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Beast SSO App</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <style>
    body {
      background: linear-gradient(135deg, #0d6efd, #6610f2);
      color: white;
      font-family: 'Segoe UI', sans-serif;
    }
    .card {
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    }
    .btn-custom {
      background-color: #ffc107;
      color: #000;
    }
    .btn-custom:hover {
      background-color: #e0a800;
    }
  </style>
</head>
<body>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 text-center" style="width: 400px;">
      <h1 class="mb-4">🌟 Beast SSO Portal</h1>
      <p class="lead">Sign in with Single Sign-On (SSO) powered by Keycloak + LDAP</p>
      <a href="/login" class="btn btn-custom btn-lg mt-3">Login with SSO</a>
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
