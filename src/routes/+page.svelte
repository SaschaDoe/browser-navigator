<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<nav>
    <h2>Explore our site:</h2>
    <ul>
        <li><a href="/about">About Us</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>

<div class="demo-interactions">
    <h3>Interactive Elements Demo</h3>
    <button type="button" on:click={() => alert('Hello from Home!')}>
        Test Button
    </button>
    
    <input type="text" placeholder="Try typing here..." />
    
    <a href="#demo" on:click|preventDefault={() => console.log('Demo link clicked')}>
        Demo Link
    </a>
</div>

<style>
    nav {
        margin: 2rem 0;
        padding: 1rem;
        background-color: #f5f5f5;
        border-radius: 8px;
    }
    
    nav ul {
        list-style: none;
        padding: 0;
    }
    
    nav li {
        margin: 0.5rem 0;
    }
    
    nav a {
        text-decoration: none;
        color: #007cba;
        font-weight: bold;
    }
    
    .demo-interactions {
        margin: 2rem 0;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
    }
    
    .demo-interactions > * {
        margin: 0.5rem;
    }
    
    button {
        background-color: #007cba;
        color: white;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    
    input {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
</style>
