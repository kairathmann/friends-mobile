#! /usr/bin/python3
import os
import socket
import subprocess
import argparse
import xml.etree.ElementTree as ET
import sys
import signal
import json
import time
import textwrap
from distutils.spawn import find_executable

try:
    from dotenv import load_dotenv
except ModuleNotFoundError:
    sys.exit("Please run 'pip install -r requirements-development.txt'")

try:
    json_data = open('./package.json', 'r')
    package_json = json.load(json_data)
    json_data.close()
except IOError:
    sys.exit("Couldn't read package.json, exiting...")

def check_prerequisites():
    engines = package_json['engines']
    if find_executable('node') is None:
        exit_msg = (
            "Please make sure you've installed node in version at least version: {} together with npm version: {}.\n"
            "We suggest using https://github.com/creationix/nvm for node version management."
        ).format(engines['node'], engines['npm'])
        sys.exit(exit_msg)
    if find_executable('pip3') is None:
        exit_msg = (
            "Please make sure you've installed pip3. We suggest it by doing following steps:\n"
            "wget https://bootstrap.pypa.io/get-pip.py\n"
            "python3 get-pip.py --user\n"
            "PATH=$PATH:$HOME/.local/bin\n"
            "Verify installation by running: pip3 --version")
        sys.exit(exit_msg)
    if find_executable('adb') is None:
        exit_msg = (
            "Please make sure you've added following paths to your $PATH enviromental variable:\n"
            "$ANDROID_HOME/tools\n"
            "$ANDROID_HOME/platform-tools\n"
            "Exiting...")
        sys.exit(exit_msg)

def check_database_connection(address='localhost', port=5432):
    s = socket.socket()
    print("Attempting to verify database connection to %s on port %s" % (address, port))
    try:
        s.connect((address, port))
        print("Successfully established connection with database!")
        return True
    except socket.error as e:
        print("Connection to %s on port %s failed: %s" % (address, port, e))
        return False
    finally:
        s.close()


def on_close_handle(signum, frame):
    subprocess.run(["adb", "kill-server"])    
    sys.exit(1)


def check_matching_react_native_version(required_major=0, required_minor=59, required_micro=1):
    react_native = package_json['dependencies']['react-native']
    major, minor, micro = [int(ch) for ch in react_native.split('.')]
    return major == required_major and minor == required_minor and micro == required_micro


def indent_xml(elem, level=0):
    i = "\n" + level*"  "
    if len(elem):
        if not elem.text or not elem.text.strip():
            elem.text = i + "  "
        if not elem.tail or not elem.tail.strip():
            elem.tail = i
        for elem in elem:
            indent_xml(elem, level+1)
        if not elem.tail or not elem.tail.strip():
            elem.tail = i
    else:
        if level and (not elem.tail or not elem.tail.strip()):
            elem.tail = i


def edit_dot_env(dot_env_filepath, ip):
    load_dotenv(dotenv_path=dot_env_filepath)
    # append_line = os.getenv('APP_AXIOS_BASE_URL') is None
    with open(dot_env_filepath, 'r+') as f:
        lines = f.readlines()
        f.seek(0)
        for line in lines:
                key, val = line.split('=')
                if key == 'APP_AXIOS_BASE_URL':
                    f.write('APP_AXIOS_BASE_URL=http://{}:8000/api/v1/\n'.format(ip))
                else:
                    f.write(line)
        f.truncate()


def edit_android_config(xml_config_path, ip):
    # TODO: run if android SDK >= 28
    react_native_xml = ET.parse(xml_config_path)
    root = react_native_xml.getroot()
    domain_config = root.find('domain-config')

    allowed_domains = [subdomain.text for subdomain in domain_config.findall('domain')]

    if ip not in allowed_domains:
        current_ip_node = ET.Element('domain')
        current_ip_node.text = ip
        current_ip_node.attrib['includeSubdomains'] = "false"
        domain_config.append(current_ip_node)
        indent_xml(root)
        print('Writing XML config changes at {}'.format(xml_config_path))
        react_native_xml.write(xml_config_path, encoding='utf-8', xml_declaration=True)

if __name__ == "__main__":
    check_prerequisites()

    signal.signal(signal.SIGINT, on_close_handle)
    signal.signal(signal.SIGHUP, on_close_handle)
    signal.signal(signal.SIGTERM, on_close_handle)

    if sys.version_info.major != 3:
        sys.exit("Use Python 3.5 or above due to subprocess.run")

    if sys.version_info.major == 3 and sys.version_info.minor < 5:
        sys.exit("Use Python 3.5 or above due to subprocess.run")    

    parser = argparse.ArgumentParser(description="Startup script to enhance development experience.")
    parser.add_argument("terminal",
        type=str,
        help="Path to terminal at which Metro bundler will be launched",
    )
    parser.add_argument("--dot_env",
        type=str,
        help="Path to .env file",
        default='./.env.development'
    )
    parser.add_argument("--java_home",
        type=str,
        help="Path to JDK binary",
        default=os.getenv('JAVA_HOME')
    )
    parser.add_argument("--android_home",
        type=str,
        help="Path to Android SDK",
        default=os.getenv('ANDROID_HOME')
    )
    parser.add_argument("--net_ip",
        type=str,
        help="IP of machine your work on (same net as mobile device)"
    )
    parser.add_argument("--react_native_android_config",
        type=str,
        help="React native android XML config file",
        default='./android/app/src/debug/res/xml/react_native_config.xml'
    )

    check_database_connection()

    args = parser.parse_args()

    if args.java_home is None or len(args.java_home) == 0:
        sys.exit("Please define JAVA_HOME enviromental variable.")

    if args.android_home is None or len(args.android_home) == 0:
        sys.exit("Please define ANDROID_HOME enviromental variable.")

    if args.net_ip is None:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('1.1.1.1', 80))
        net_ip = s.getsockname()[0]
    else:
        net_ip = args.net_ip

    print('Local machine IP working on:', net_ip)
    print('Java executable path:', args.java_home)
    print('Android SDK path:', args.android_home)

    edit_dot_env(args.dot_env, net_ip)
    # That react_config_xml got added at 0.59 and removed at 0.59.2... Keep an eye for any further changes...
    if check_matching_react_native_version(0, 59, 1) or check_matching_react_native_version(0, 59, 0):
         edit_android_config(args.react_native_android_config, net_ip)

    subprocess.run(["adb", "kill-server"])
    # # TODO: check if any device was detected
    subprocess.run(["adb", "devices"])
    subprocess.run(["adb", "reverse", "tcp:8081", "tcp:8081"])

    android_handle = subprocess.Popen(
        ["npm", "run", "android-dev-terminal"],
        env=dict(os.environ, JAVA_HOME=args.java_home, REACT_TERMINAL=args.terminal)
    )

    while True:
        time.sleep(1)
