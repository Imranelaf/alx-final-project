import os

# Output file where the directory tree and file content will be saved
output_file = 'file.txt'

# File extensions to include in the output
include_extensions = ['.js', '.jsx']

def create_tree_with_content(root_dir, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        for dirpath, dirnames, filenames in os.walk(root_dir):
            # Exclude node_modules directory
            dirnames[:] = [d for d in dirnames if d != 'node_modules']
            
            # Calculate the relative indentation level
            level = dirpath.replace(root_dir, '').count(os.sep)
            indent = ' ' * 2 * level
            f.write(f'{indent}|-{os.path.basename(dirpath)}/\n')
            
            # Process files in the directory
            for filename in filenames:
                file_ext = os.path.splitext(filename)[1]
                if file_ext in include_extensions:
                    filepath = os.path.join(dirpath, filename)
                    
                    # Write the file name in the tree structure
                    f.write(f'{indent}  |-{filename}\n')

                    # Try to read and write the content of the file
                    try:
                        with open(filepath, 'r', encoding='utf-8') as file_content:
                            content = file_content.read()
                            # Indent the content of the file under its name
                            for line in content.splitlines():
                                f.write(f'{indent}    {line}\n')
                    except Exception as e:
                        f.write(f'{indent}    [Error reading file: {e}]\n')

if __name__ == "__main__":
    # Specify the root directory for the tree (current directory by default)
    root_directory = '.'
    create_tree_with_content(root_directory, output_file)
    print(f'Directory tree and file contents saved to {output_file}')
