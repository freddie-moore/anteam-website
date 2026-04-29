<?php

session_start();

$clientId = getenv('AZURE_CLIENT_ID');
$tenantId = getenv('AZURE_TENANT_ID');
$clientSecret = getenv('AZURE_CLIENT_SECRET');

$redirectUri = getenv('CONTACT_REDIRECT_URI');

$authUrl = "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/authorize";
$tokenUrl = "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token";

// STEP 1: If no code, redirect to login
if (!isset($_GET['code'])) {

    // store form data in session
    $_SESSION['form'] = $_POST;

    $params = [
        "client_id" => $clientId,
        "response_type" => "code",
        "redirect_uri" => $redirectUri,
        "response_mode" => "query",
        "scope" => "openid profile offline_access Mail.Send"
    ];

    header("Location: $authUrl?" . http_build_query($params));
    exit();
}

// STEP 2: Exchange code for token
$data = [
    "client_id" => $clientId,
    "scope" => "https://graph.microsoft.com/.default",
    "code" => $_GET['code'],
    "redirect_uri" => $redirectUri,
    "grant_type" => "authorization_code",
];

if (!empty($clientSecret)) {
    $data["client_secret"] = $clientSecret;
}

$options = [
    "http" => [
        "header" => "Content-type: application/x-www-form-urlencoded",
        "method" => "POST",
        "content" => http_build_query($data),
    ]
];

$response = file_get_contents($tokenUrl, false, stream_context_create($options));
$token = json_decode($response, true);

if (!isset($token['access_token'])) {
    die("❌ Token error: " . print_r($token, true));
}

$accessToken = $token['access_token'];

// STEP 3: Get form data
$form = $_SESSION['form'];

$name = $form['name'];
$company = $form['company'];
$email = $form['email'];
$message = $form['message'];

// STEP 4: Build email
$emailData = [
    "message" => [
        "subject" => "New Contact Form Submission",
        "body" => [
            "contentType" => "Text",
            "content" =>
                "Name: $name\n" .
                "Company: $company\n" .
                "Email: $email\n\n" .
                "Message:\n$message"
        ],
        "toRecipients" => [
            [
                "emailAddress" => [
                    "address" => getenv('CONTACT_RECIPIENT_EMAIL')
                ]
            ]
        ]
    ]
];

// STEP 5: Send via Graph API
$ch = curl_init("https://graph.microsoft.com/v1.0/me/sendMail");

curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $accessToken",
    "Content-Type: application/json"
]);

curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($emailData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($status == 202) {
    header("Location: /?submitted=success#contact");
} else {
    header("Location: /?submitted=error#contact");
}
exit();