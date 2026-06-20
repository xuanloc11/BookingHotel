import os
import re

fe_src = r'c:\Users\Laptop\Documents\GitHub\BookingHotel\FE\src'

def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    # Replace `/vendor/` with `/extranet/`
    content = content.replace('/vendor/', '/extranet/')
    # Replace `/vendor"` with `/extranet"`
    content = content.replace('/vendor"', '/extranet"')
    # Replace `"Booking Vendor"` with `"Booking Extranet"`
    content = content.replace('Booking Vendor', 'Booking Extranet')
    # Replace `"Cổng Đối Tác"` with `"Extranet Đối Tác"`
    content = content.replace('Cổng Đối Tác', 'Extranet Đối Tác')
    # Replace `VendorLayout` with `ExtranetLayout`
    content = content.replace('VendorLayout', 'ExtranetLayout')
    # Replace `VendorDashboard` with `ExtranetDashboard`
    content = content.replace('VendorDashboard', 'ExtranetDashboard')
    
    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {path}")

for root, dirs, files in os.walk(fe_src):
    # skip vendor folder since we are deleting it anyway, but we can update extranet
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

print("Replacement done.")
