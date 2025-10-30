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
        files = sandbox.files.list(path)
        return "\n".join([f"{f.name} ({'dir' if f.is_dir else 'file'})" for f in files])
    except Exception as e:
        return f"Error listing files: {str(e)}"


@tool
def run_command(sandbox_id: str, command: str) -> str:
    """Execute a shell command in the E2B sandbox."""
    print(f"Running command in sandbox {sandbox_id}: {command}")
    try:
        sandbox = Sandbox.connect(sandbox_id=sandbox_id)
        result = sandbox.commands.run(command)
        output = []
        if result.stdout:
            output.append(f"STDOUT:\n{result.stdout}")
        if result.stderr:
            output.append(f"STDERR:\n{result.stderr}")
        output.append(f"Exit code: {result.exit_code}")
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
        sandbox.files.makeDir(path)
        print(f"Successfully created directory {path} in sandbox {sandbox_id}")
        return f"Successfully created directory {path}"
    except Exception as e:
        return f"Error creating directory: {str(e)}"


def get_e2b_tools():
    """Return all E2B tools for LLM binding."""
    return [
        write_file,
        read_file,
        list_files,
        run_command,
        install_package,
        create_directory
    ]
