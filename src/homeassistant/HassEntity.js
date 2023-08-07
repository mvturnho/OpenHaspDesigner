class HassEntity {
    entyty_id = 'fake.entity';
    hass_type = 'time';
    hasp_page = 4;
    hasp_id = 20;

    getHassConfig(hassConfig) {
        var object = {};
        object.obj = 'p'+this.hasp_page+'b'+this.hasp_id;
        hassConfig.objects += object;
        return hassConfig;
    }
}

        