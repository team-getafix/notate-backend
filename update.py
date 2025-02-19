import os
import sys
import subprocess

def build_docker_image(directory: str, image_name: str) -> None:
    if not os.path.isdir(directory):
        print(f"error: directory '{directory}' does not exist")

        sys.exit(1)

    try:
        subprocess.run(["docker", "build", "-t", image_name, directory], check=True)
    except subprocess.CalledProcessError:
        sys.exit(1)

def push_docker_image(image_name: str) -> None:
    try:
        subprocess.run(["docker", "push", image_name], check=True)
    except subprocess.CalledProcessError:
        sys.exit(1)

def build_and_push_service(service_name: str) -> None:
    directory = os.path.join("services", service_name)
    image_name = f"glomdom/{service_name}:latest"

    build_docker_image(directory, image_name)
    push_docker_image(image_name)

def build_and_push_api_gateway() -> None:
    directory = "api-gateway"
    image_name = "glomdom/api-gateway:latest"

    build_docker_image(directory, image_name)
    push_docker_image(image_name)

def main():
    if len(sys.argv) < 2:
        print("Usage: update.py <service1> <service2> ...")
        sys.exit(1)

    services = sys.argv[1:]
    for service in services:
        build_and_push_service(service)

    build_and_push_api_gateway()

if __name__ == "__main__":
    main()