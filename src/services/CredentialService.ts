import bcrypt from 'bcryptjs';
export class CredentialService {
    async comparePassword(password: string, hashedPassword: string) {
        console.log('password', password);
        console.log('Db password', hashedPassword);
        const isMatched = await bcrypt.compare(password, hashedPassword);
        console.log('ismatched', isMatched);
        return isMatched;
    }
}
