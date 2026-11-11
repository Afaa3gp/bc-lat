import os
import zipfile
import paramiko

VPS_HOST = '141.11.160.130'
VPS_PORT = 20141
VPS_USER = 'root'
VPS_PASS = 'TXMkUs6Dc4JYlopW'

def deploy():
    print('📦 1. Memeriksa folder dist/ ...')
    if not os.path.exists('dist'):
        print('Building project...')
        os.system('npm run build')

    print('🗜️ 2. Mengompres folder dist/ ...')
    zip_path = 'dist.zip'
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk('dist'):
            for f in files:
                full = os.path.join(root, f)
                rel = os.path.relpath(full, 'dist')
                zf.write(full, rel)
    print(f'   Ukuran file: {os.path.getsize(zip_path) / 1024:.1f} KB')

    print('🚀 3. Menghubungkan ke VPS via SSH/SFTP...')
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, port=VPS_PORT, username=VPS_USER, password=VPS_PASS, timeout=15)

    sftp = ssh.open_sftp()
    print('   Mengunggah dist.zip ke /var/www/ ...')
    sftp.put(zip_path, '/var/www/dist.zip')
    sftp.close()

    print('⚡ 4. Mengekstrak dan merestart Nginx di VPS...')
    cmd = '''
    mkdir -p /var/www/bclat
    unzip -o /var/www/dist.zip -d /var/www/bclat > /dev/null
    rm -f /var/www/dist.zip
    chown -R www-data:www-data /var/www/bclat
    systemctl reload nginx
    '''
    stdin, stdout, stderr = ssh.exec_command(cmd)
    stdout.channel.recv_exit_status()

    ssh.close()
    if os.path.exists(zip_path):
        os.remove(zip_path)

    print('\n✅ DEPLOY SUKSES!')
    print('🌐 Website aktif di: http://141.11.160.130:30006')

if __name__ == '__main__':
    deploy()
