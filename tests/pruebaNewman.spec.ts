import { test, expect } from '@playwright/test'
import { correrNewman } from '../pages/NewmanRunner'

test('correr la colecicon de postman', async () => {
    const resumen = await correrNewman('01 - Fundamentos');

    const cuantasFallaron = resumen.run.stats.assertions.failed;

    expect(cuantasFallaron).toBe(0);
})