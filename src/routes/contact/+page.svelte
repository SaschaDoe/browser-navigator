<h1>Contact Us</h1>
<p>Get in touch with our team!</p>

<form class="contact-form">
    <div>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required />
    </div>
    
    <div>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required />
    </div>
    
    <div>
        <label for="subject">Subject:</label>
        <select id="subject" name="subject">
            <option value="general">General Inquiry</option>
            <option value="support">Support</option>
            <option value="feedback">Feedback</option>
        </select>
    </div>
    
    <div>
        <label for="message">Message:</label>
        <textarea id="message" name="message" rows="5" required></textarea>
    </div>
    
    <button type="submit">Send Message</button>
</form>

<div class="navigation">
    <a href="/">Home</a> | 
    <a href="/about">About</a>
</div>

<style>
    .contact-form {
        max-width: 500px;
        margin: 2rem 0;
    }
    
    .contact-form div {
        margin-bottom: 1rem;
    }
    
    .contact-form label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
    }
    
    .contact-form input,
    .contact-form select,
    .contact-form textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    
    .contact-form button {
        background-color: #007cba;
        color: white;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    
    .navigation {
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid #eee;
    }
    
    .navigation a {
        text-decoration: none;
        color: #007cba;
    }
</style> 