<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$name    = htmlspecialchars(trim($_POST['name']    ?? ''));
$company = htmlspecialchars(trim($_POST['company'] ?? ''));
$email   = htmlspecialchars(trim($_POST['email']   ?? ''));
$message = htmlspecialchars(trim($_POST['message'] ?? ''));

if (empty($name) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: index.html#contact?error=invalid');
    exit;
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';        // SMTP server
    $mail->SMTPAuth   = true;
    $mail->Username   = 'helen@anteam.ai';        // SMTP username
    $mail->Password   = 'YOUR_APP_PASSWORD';      // SMTP password / app password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    $mail->setFrom('noreply@anteam.co.uk', 'Anteam Website');
    $mail->addAddress('helen@anteam.ai', 'Helen');
    $mail->addReplyTo($email, $name);

    $mail->Subject = 'New enquiry from ' . $name . ($company ? ' — ' . $company : '');

    $mail->isHTML(false);
    $mail->Body  = "Name:    $name\n";
    $mail->Body .= "Company: $company\n";
    $mail->Body .= "Email:   $email\n";
    $mail->Body .= "\n---\n\n";
    $mail->Body .= $message;

    $mail->send();
    header('Location: index.html?sent=1#contact');

} catch (Exception $e) {
    error_log('Mailer error: ' . $mail->ErrorInfo);
    header('Location: index.html?error=1#contact');
}
exit;
