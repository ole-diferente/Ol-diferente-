import re
import os

prices = {
    "club-de-nuit.html": 78000,
    "club-de-nuit-women.html": 78000,
    "salvo-elixir.html": 63000,
    "liquid-brun.html": 98000,
    "dark-door-sport.html": 59000,
    "hawas-for-him.html": 67000,
    "badee-al-oud-for-glory.html": 68000,
    "honor-and-glory.html": 68000,
    "khamrah-dukhan.html": 68000,
    "eclaire.html": 72000,
    "lattafa-his-confession.html": 74000,
    "oud-forever.html": 79000,
    "sceptre-malachite.html": 69900,
    "afnan-9pm.html": 78000,
    "turathi-blue.html": 84000,
    "vintage-radio.html": 69000,
    "shaheen-gold.html": 72000,
    "aqua-kiss.html": 49000,
    "bare-vanilla.html": 49000,
    "coconut-passion.html": 49000,
    "pure-seduction.html": 49000,
    "vs-rush.html": 49000
}

def format_price(p):
    return f"{p:,}".replace(',', '.')

def update_tienda():
    path = "tienda.html"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Split into cards to safely update
    cards = re.split(r'(<div class="product-card.*?>)', content)
    
    new_content = cards[0]
    
    for i in range(1, len(cards), 2):
        card_start = cards[i]
        card_body = cards[i+1] if i+1 < len(cards) else ""
        
        # Find which file it links to
        match = re.search(r'href="(.*?\.html)"', card_body)
        if match:
            filename = match.group(1)
            if filename in prices:
                new_price = prices[filename]
                formatted = format_price(new_price)
                
                # Update card_start data-price
                card_start = re.sub(r'data-price="\d+"', f'data-price="{new_price}"', card_start)
                
                # Update full size button price
                card_body = re.sub(r'(data-type="full" data-price=")([\d\.]+)(0*)(".*?disabled>)?(.*?ml</button>)', 
                                   fr'\1{formatted}\4\5', card_body)
                card_body = re.sub(r'(data-type="full" data-price=")([\d\.]+)(0*)(">)', 
                                   fr'\1{formatted}\4', card_body)

                # Update main price display
                card_body = re.sub(r'<div class="product-price">.*?</div>', 
                                   f'<div class="product-price">${formatted}</div>', card_body)
        
        new_content += card_start + card_body
        
    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("tienda.html updated")

def update_product_pages():
    for filename, new_price in prices.items():
        if os.path.exists(filename):
            with open(filename, "r", encoding="utf-8") as f:
                content = f.read()
            
            formatted = format_price(new_price)
            # Find the detail price container and update the span inside
            content = re.sub(r'<span class="detail-price"(.*?)>\$?[0-9\.]+.*?</span>', 
                             fr'<span class="detail-price"\1>${formatted}</span>', content)
            
            # Or if it is 'Por definir' without a span or with a span
            content = re.sub(r'<span class="detail-price"(.*?)>Por definir</span>', 
                             fr'<span class="detail-price"\1>${formatted}</span>', content)
            
            with open(filename, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"{filename} updated")

update_tienda()
update_product_pages()
