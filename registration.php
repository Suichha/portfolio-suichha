<?php
// Initialize variables
$name = $email = "";
$errors = [];
$successMessage = "";

// When form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Get form data
    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $password = $_POST["password"];
    $confirmPassword = $_POST["confirm_password"];

    // Validation
    if (empty($name)) {
        $errors["name"] = "Name is required";
    }

    if (empty($email)) {
        $errors["email"] = "Email is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors["email"] = "Invalid email format";
    }

    if (empty($password)) {
        $errors["password"] = "Password is required";
    } elseif (strlen($password) < 6) {
        $errors["password"] = "Password must be at least 6 characters";
    }

    if ($password !== $confirmPassword) {
        $errors["confirm_password"] = "Passwords do not match";
    }

    // If no errors, save data
    if (empty($errors)) {
        $file = "users.json";

        // Read existing data
        if (file_exists($file)) {
            $jsonData = file_get_contents($file);
            $users = json_decode($jsonData, true);
        } else {
            $users = [];
        }

        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // New user array
        $newUser = [
            "name" => $name,
            "email" => $email,
            "password" => $hashedPassword
        ];

        // Add user to array
        $users[] = $newUser;

        // Save back to JSON file
        if (file_put_contents($file, json_encode($users, JSON_PRETTY_PRINT))) {
            $successMessage = "Registration successful!";
            $name = $email = "";
        } else {
            $errors["file"] = "Error saving user data.";
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>User Registration</title>
    <style>
        .error { color: red; }
        .success { color: green; }
    </style>
</head>
<body>

<h2>User Registration</h2>

<?php if (!empty($successMessage)): ?>
    <div class="success"><?php echo $successMessage; ?></div>
<?php endif; ?>

<form method="post" action="">
    <label>Name:</label><br>
    <input type="text" name="name" value="<?php echo htmlspecialchars($name); ?>">
    <div class="error"><?php echo $errors["name"] ?? ""; ?></div><br>

    <label>Email:</label><br>
    <input type="text" name="email" value="<?php echo htmlspecialchars($email); ?>">
    <div class="error"><?php echo $errors["email"] ?? ""; ?></div><br>

    <label>Password:</label><br>
    <input type="password" name="password">
    <div class="error"><?php echo $errors["password"] ?? ""; ?></div><br>

    <label>Confirm Password:</label><br>
    <input type="password" name="confirm_password">
    <div class="error"><?php echo $errors["confirm_password"] ?? ""; ?></div><br>

    <button type="submit">Register</button>
</form>

</body>
</html>
