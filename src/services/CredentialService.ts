import bcrypt from 'bcryptjs';
export class CredentialService {
    async comparePassword(password: string, hashedPassword: string) {
        const isMatched = await bcrypt.compare(password, hashedPassword);
        console.log('ismatched', isMatched);
        return isMatched;
    }
}
