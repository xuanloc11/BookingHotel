USD_RATE = 25000

def convert_currency(data, to_currency='VND'):
    if to_currency == 'VND' or to_currency is None:
        return data

    if isinstance(data, list):
        return [convert_currency(item, to_currency) for item in data]
    elif isinstance(data, dict):
        new_data = data.copy()
        if 'price_per_night' in new_data:
            new_data['price_per_night'] = int(new_data['price_per_night'] / USD_RATE)
            new_data['currency'] = 'USD'
        if 'price' in new_data:
            if isinstance(new_data['price'], (int, float)):
                new_data['price'] = int(new_data['price'] / USD_RATE)
            elif isinstance(new_data['price'], dict):
                for k, v in new_data['price'].items():
                    if isinstance(v, (int, float)):
                        new_data['price'][k] = int(v / USD_RATE)
        if 'total' in new_data:
            new_data['total'] = int(new_data['total'] / USD_RATE)
            new_data['currency'] = 'USD'
        
        for key, value in new_data.items():
            if isinstance(value, (dict, list)) and key != 'price': # price dict already handled
                new_data[key] = convert_currency(value, to_currency)
        return new_data
    return data

def translate_status(data, language='vi'):
    if language == 'en' or language is None:
        return data
        
    status_map = {
        'pending': 'Đang chờ',
        'confirmed': 'Đã xác nhận',
        'cancelled': 'Đã huỷ',
        'completed': 'Hoàn thành'
    }
    
    if isinstance(data, list):
        return [translate_status(item, language) for item in data]
    elif isinstance(data, dict):
        new_data = data.copy()
        if 'status' in new_data and new_data['status'] in status_map:
            new_data['status_display'] = status_map[new_data['status']]
            
        for key, value in new_data.items():
            if isinstance(value, (dict, list)):
                new_data[key] = translate_status(value, language)
        return new_data
    return data
