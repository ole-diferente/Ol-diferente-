import os
import requests
from bs4 import BeautifulSoup
import re

def limpiar_nombre(nombre):
    # Elimina caracteres que Windows/Mac no permiten en los nombres de archivo
    return re.sub(r'[\\/*?:"<>|]', "", nombre)

def descargar_imagenes_fragrantica():
    url = "https://www.fragrantica.es/notas/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    }
    
    print("Conectando a Fragrantica...")
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        print(f"Error al acceder a la página. Código: {response.status_code}")
        return
        
    soup = BeautifulSoup(response.text, "html.parser")
    
    # Crear la carpeta donde se guardarán todas las imágenes
    carpeta_img = "Imagenes_Notas_Olfativas"
    if not os.path.exists(carpeta_img):
        os.makedirs(carpeta_img)
        print(f"Carpeta '{carpeta_img}' creada.")
        
    enlaces = soup.find_all('a', href=True)
    notas_procesadas = set()
    descargadas = 0
    
    print(f"Buscando y descargando imágenes en la carpeta '{carpeta_img}'... Esto puede tomar un par de minutos.")
    
    for enlace in enlaces:
        if '/notas/' in enlace['href']:
            img_tag = enlace.find('img')
            if img_tag:
                nombre = enlace.text.strip()
                if not nombre:
                    nombre = img_tag.get('alt', 'Desconocido').strip()
                    
                img_url = img_tag.get('src')
                if img_url and img_url.startswith('/'):
                    img_url = "https://www.fragrantica.es" + img_url
                    
                # Evitar descargar la misma nota dos veces
                if nombre and img_url and nombre not in notas_procesadas:
                    notas_procesadas.add(nombre)
                    
                    try:
                        # Descargar el contenido de la imagen
                        img_data = requests.get(img_url, headers=headers).content
                        
                        # Limpiar el nombre para que sea un archivo válido y agregar .jpg
                        nombre_archivo = limpiar_nombre(nombre) + ".jpg"
                        ruta_archivo = os.path.join(carpeta_img, nombre_archivo)
                        
                        # Guardar la imagen en tu disco duro
                        with open(ruta_archivo, 'wb') as handler:
                            handler.write(img_data)
                            
                        descargadas += 1
                        
                        # Mostrar progreso
                        if descargadas % 20 == 0:
                            print(f"Se han descargado {descargadas} imágenes...")
                            
                    except Exception as e:
                        print(f"No se pudo descargar la imagen de {nombre}: {e}")
    
    print(f"\n¡Proceso completado! Se descargaron un total de {descargadas} imágenes.")
    print(f"Puedes encontrarlas en la carpeta: {os.path.abspath(carpeta_img)}")

if __name__ == "__main__":
    descargar_imagenes_fragrantica()