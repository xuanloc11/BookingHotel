import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BE.settings')
django.setup()

from app.models import Hotel, VendorSetting

def remove_accents(input_str):
    s1 = u'ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠạẢảẤấẦầẨẩẪẫẬậẮắẰằẲẳẴẵẶặẸẹẺẻẼẽẾếỀềỂểỄễỆệỈỉỊịỌọỎỏỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợỤụỦủỨứỪừỬửỮữỰựỲỳỴỵỶỷỸỹ'
    s0 = u'AAAAEEEIIOOOOUUYaaaaeeeiioooouuyAaDdIiUuOoUuAaAaAaAaAaAaAaAaAaAaAaAaEeEeEeEeEeEeEeEeIiIiOoOoOoOoOoOoOoOoOoOoOoOoUuUuUuUuUuUuUuYyYyYyYy'
    s = ''
    for c in input_str:
        if c in s1:
            s += s0[s1.index(c)]
        else:
            s += c
    return s

def seed_settings():
    hotels = Hotel.objects.filter(owner__isnull=False)
    if not hotels:
        print("No hotels with owners found.")
        return

    banks = ["Vietcombank", "Techcombank", "MBBank", "BIDV", "VietinBank", "ACB", "Sacombank", "VPBank", "Agribank", "TPBank"]
    branches = ["Chi nhánh Hội Sở", "Chi nhánh Hà Nội", "Chi nhánh TP.HCM", "Chi nhánh Đà Nẵng", "Chi nhánh Hải Phòng", "Chi nhánh Cần Thơ", "Chi nhánh Bình Dương", "Chi nhánh Đồng Nai"]

    for hotel in hotels:
        user = hotel.owner
        setting, created = VendorSetting.objects.get_or_create(user=user)

        # Company legal info
        setting.company_name = f"Công ty TNHH {hotel.name}"
        # Tax ID: random 10 digits starting with 010 or 030
        prefix = random.choice(["010", "030", "031", "040"])
        setting.tax_id = f"{prefix}{random.randint(1000000, 9999999)}"

        # Bank info
        setting.bank_name = random.choice(banks)
        setting.bank_branch = random.choice(branches)
        
        # Account name: company name without accents and uppercase
        acc_name = remove_accents(hotel.name).upper()
        setting.account_name = f"CTY TNHH {acc_name}"
        
        # Account number: 10 to 14 digits
        length = random.randint(10, 14)
        acc_number = "".join([str(random.randint(0, 9)) for _ in range(length)])
        setting.account_number = acc_number

        setting.save()

        print(f"Updated settings for hotel ID {hotel.id} (User: {user.email})")

    print("Successfully seeded vendor settings!")

if __name__ == '__main__':
    seed_settings()
