<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Contact Form Test</title>
    <style>
        body { font-family: sans-serif; max-width: 600px; margin: 60px auto; padding: 0 20px; }
        label { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 4px; margin-top: 20px; }
        input, textarea { width: 100%; padding: 10px 14px; border: 1px solid #ccc; font-size: 14px; box-sizing: border-box; }
        textarea { height: 120px; resize: none; }
        button { margin-top: 24px; padding: 12px 28px; background: #111; color: #fff; border: none; font-size: 14px; cursor: pointer; }
        button:hover { background: #333; }
    </style>
</head>
<body>
    <h2>Contact</h2>
    <form action="contact.php" method="POST">
        <label for="name">Your Name</label>
        <input id="name" name="name" type="text" placeholder="John Smith" required/>

        <label for="company">Company</label>
        <input id="company" name="company" type="text" placeholder="Acme Logistics Ltd"/>

        <label for="email">Email</label>
        <input id="email" name="email" type="email" placeholder="john@acmelogistics.com" required/>

        <label for="message">Message</label>
        <textarea id="message" name="message" placeholder="Tell us about the inefficiencies, costs, or bottlenecks you're dealing with..."></textarea>

        <button type="submit">Send Message</button>
    </form>
</body>
</html>
