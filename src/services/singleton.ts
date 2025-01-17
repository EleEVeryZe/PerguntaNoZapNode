export function singleton(newInstance: any) {
    let instances: any[] = [];
    return {
        getInstance: function (id: string, args: any) {
            const old = instances.find((inst) => inst.id == id);
            if (!old) {
                const young = new newInstance(args);
                instances.push(young);
                return young;
            }
        
            return old;
        }
    }
}