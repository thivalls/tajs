import { describe, it, expect } from '@jest/globals'
import Person from '../src/person';

describe('#Person suite', () => {
    
    describe('#Validate suite', () => {
        it('should throw if name is not provided', () => {
            const person = { cpf: '123.222.333-02' }
            expect(() => Person.validate(person)).toThrow(new Error('Name is required'));
        });
        
        it('should throw if cpf is not provided', () => {
            const person = { name: 'Zezin programador' }
            expect(() => Person.validate(person)).toThrow(new Error('CPF is required'));
        });

        it('should not throw if cpf and name is provided', () => {
            const person = { name: 'Zezin programador', cpf: '123.222.333-02' }
            expect(() => Person.validate(person)).not.toThrow();
        }); 
    });

    describe('# Suite for format', () => {
        it('should format person info', () => {
            const person = {
                name: 'Xuxa da Silva',
                cpf: '123.222.333-02'
            }

            const formatedPerson = Person.format(person);

            const expectResult = {
                cpf: '12322233302',
                name: 'Xuxa',
                lastName: 'da Silva'
            }

            expect(formatedPerson).toStrictEqual(expectResult);
        });
    });

    describe('# Suite for save', () => {
        it('should throw if some field is not provided to save method', () => {
            const person = {
                cpf: '12322233302',
                name: 'Xuxa',
                lastName: 'da Silva'
            }

            expect(() => Person.save(person)).not.toThrow();
        });
    });

});

