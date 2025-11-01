from typing import Optional
from langchain_core.tools import tool
from e2b_code_interpreter import Sandbox


@tool
def write_file(sandbox_id: str, path: str, content: str) -> str:
    """Write content to a file in the E2B sandbox."""
    print(f"Writing to {path} in sandbox {sandbox_id}")
    try:
        sandbox = Sandbox.connect(sandbox_id=sandbox_id)
        sandbox.files.write(path, content)
        return f"Successfully wrote to {path}"
    except Exception as e:
        return f"Error writing file: {str(e)}"




@tool
def read_file(sandbox_id: str, path: str) -> str:
    """Read content from a file in the E2B sandbox."""
    print(f"Reading from {path} in sandbox {sandbox_id}")
    try:
        sandbox = Sandbox.connect(sandbox_id=sandbox_id)
        content = sandbox.files.read(path)
        return content
    except Exception as e:
        return f"Error reading file: {str(e)}"


@tool
def list_files(sandbox_id: str, path: str = "/home/user") -> str:
    """List all files in a directory in the E2B sandbox."""
    print(f"Listing files in {path} in sandbox {sandbox_id}")
    try:
        sandbox = Sandbox.connect(sandbox_id=sandbox_id)
        result = sandbox.commands.run(f"find {path} -type f")
        print(result.stdout)     
        # return "\n".join([f"{f.name} ({'dir' if f.is_dir else 'file'})" for f in result])
        return result.stdout
    except Exception as e:
        return f"Error listing files: {str(e)}"


@tool
def run_command(sandbox_id: str, command: str) -> str:
    """Execute a shell command in the E2B sandbox."""
    print(f"Running command in sandbox {sandbox_id}: {command}")
    try:
        sandbox = Sandbox.connect(sandbox_id=sandbox_id)
        result = sandbox.commands.run(command)
        print("command result: ", result)
        output = []
        if result.stdout:
            output.append(f"STDOUT:\n{result.stdout}")
        if result.stderr:
            output.append(f"STDERR:\n{result.stderr}")
        output.append(f"Exitt code: {result.exit_code}")
        return "\n".join(output)
    except Exception as e:
        return f"Error running command: {str(e)}"
    
@tool
def run_project_command(sandbox_id: str, command: str, project_dir: Optional[str] = None) -> str:
    """Execute a shell command in the E2B sandbox within a specific project directory."""
    print(f"Running command in sandbox {sandbox_id} in project dir {project_dir}: {command}")
    try:
        sandbox = Sandbox.connect(sandbox_id=sandbox_id)
        if project_dir:
            full_command = f"cd {project_dir} && {command}"
        else:
            full_command = command
        result = sandbox.commands.run(full_command)
        print("command result: ", result)
        output = []
        if result.stdout:
            output.append(f"STDOUT:\n{result.stdout}")
        if result.stderr:
            output.append(f"STDERR:\n{result.stderr}")
        output.append(f"Exitt code: {result.exit_code}")
        return "\n".join(output)
    except Exception as e:
        return f"Error running command: {str(e)}"


@tool
def install_package(sandbox_id: str, package: str, package_manager: str = "npm") -> str:
    """Install a package in the E2B sandbox using npm, pip, or other package managers."""
    print(f"Installing {package} in sandbox {sandbox_id} using {package_manager}")
    try:
        sandbox = Sandbox.connect(sandbox_id=sandbox_id)
        if package_manager == "npm":
            command = f"npm install {package}"
        elif package_manager == "pip":
            command = f"pip install {package}"
        elif package_manager == "yarn":
            command = f"yarn add {package}"
        else:
            return f"Unsupported package manager: {package_manager}"
        
        result = sandbox.commands.run(command)
        if result.exit_code == 0:
            return f"Successfully installed {package} using {package_manager}"
        else:
            return f"Failed to install {package}: {result.stderr}"
    except Exception as e:
        return f"Error installing package: {str(e)}"


@tool
def create_directory(sandbox_id: str, path: str) -> str:
    """Create a directory in the E2B sandbox."""
    print(f"Creating directory {path} in sandbox {sandbox_id}")
    try:
        sandbox = Sandbox.connect(sandbox_id=sandbox_id)
        print(f"get sandbox {sandbox_id}")
        sandbox.files.make_dir(path)
        print(f"Successfully created directory {path} in sandbox {sandbox_id}")
        return f"Successfully created directory {path}"
    except Exception as e:
        return f"Error creating directory: {str(e)}"
    
# -----
from app.core.config import settings

import os

def create_sandbox():
    print("Creating sandbox...")
    try:
        os.environ["E2B_API_KEY"] = settings.E2B_API_KEY
        sandbox = Sandbox.create()
        print("✅ Sandbox created successfully.")
        return sandbox
    except Exception as e:
        print(f"❌ Failed to create sandbox: {e}")
        return None


sandbox = create_sandbox()

def replicate_directory_structure(source_dir, target_dir="project"):
    """Recursively replicate entire directory structure with all files."""
    files_to_upload = []
    
    for root, subdirs, files in os.walk(source_dir):
        rel_root = os.path.relpath(root, source_dir)
        
        if rel_root == '.':
            sandbox_path = target_dir
        else:
            sandbox_path = os.path.join(target_dir, rel_root).replace('\\', '/')
        
        for filename in files:
            local_file_path = os.path.join(root, filename)
            rel_file_path = os.path.relpath(local_file_path, source_dir)
            sandbox_file_path = os.path.join(target_dir, rel_file_path).replace('\\', '/')
            
            try:
                with open(local_file_path, "rb") as f:
                    files_to_upload.append({
                        'path': sandbox_file_path,
                        'data': f.read()
                    })
                    print(f"✅ Prepared: {sandbox_file_path}")
            except Exception as e:
                print(f"❌ Failed to read {local_file_path}: {e}")
    
    return files_to_upload

@tool
def pull_template_in_sandbox(sandbox_id: str, target_dir: str = "project") -> str:
    """Pull react template into the E2B sandbox.
    
    This will create a complete React + Vite + TypeScript template with the following structure:
    - package.json (React, Vite, TypeScript dependencies)
    - vite.config.ts
    - tsconfig.json
    - index.html
    - src/App.tsx (main app component)
    - src/main.tsx (entry point)
    - src/App.css and src/index.css
    - public/vite.svg
    - src/assets/react.svg

    Args: 
        sandbox_id (str): The ID of the E2B sandbox.
        target_dir (str): The target directory in the sandbox to place the template. Name it according to the use case.
    
    Returns:
        str: Success message with file count and directory name.
    """
    try:
        source = r"D:\Desktop\super30\codekar\templates\react"
        sandbox = Sandbox.connect(sandbox_id=sandbox_id)
        
        files = replicate_directory_structure(source, target_dir or "react-project")
        
        print(f"\n📦 Total files prepared: {len(files)}")
        print("⬆️  Uploading to sandbox...")
        
        sandbox.files.write_files(files)
        
        print("✅ All files uploaded successfully!")
        result = sandbox.commands.run(f"find {target_dir} -type f")
        print(f"📁 Files in {target_dir}:\n{result.stdout}")
        
        return f"Successfully pulled React template into {target_dir}. Total files: {len(files)}. Now you can modify the files as needed."
    except Exception as e:
        return f"Error pulling template: {str(e)}"


def get_e2b_tools():
    """Return all E2B tools for LLM binding."""
    return [
        write_file,
        read_file,
        # list_files,
        run_command,
        install_package,
        create_directory,
        pull_template_in_sandbox,
        run_project_command
    ]
