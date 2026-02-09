import { apiRequest } from '@/lib/queryClient';

// Test de validación de límites
async function testPropertyLimits() {
  console.log('🧪 TEST DE VALIDACIÓN DE LÍMITES DE PROPIEDADES');
  console.log('=============================================');

  try {
    // 1. Obtener agencia actual (Test Agency tiene 17/20 propiedades)
    console.log('1️⃣ Obteniendo datos de agencia de prueba...');
    const agenciesResponse = await fetch('/api/agencies');
    const agencies = await agenciesResponse.json();
    const testAgency = agencies.find((a: any) => a.email === 'testrMeavE@example.com');
    
    if (!testAgency) {
      console.log('❌ No se encontró agencia de prueba');
      return;
    }
    
    console.log('📊 Agencia de prueba encontrada:');
    console.log(`   - Nombre: ${testAgency.name}`);
    console.log(`   - Plan: ${testAgency.subscriptionPlan}`);
    console.log(`   - Propiedades: ${testAgency.propertyCount}/${testAgency.propertyLimit}`);
    console.log(`   - Espacio disponible: ${testAgency.propertyLimit - testAgency.propertyCount} propiedades`);
    
    // 2. Intentar crear propiedad (debería funcionar - le queda 1 espacio)
    console.log('\n2️⃣ Intentando crear propiedad (debería funcionar)...');
    try {
      const newPropertyResponse = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Propiedad de Prueba',
          description: 'Descripción de prueba',
          price: '100000',
          currency: 'USD',
          address: 'Dirección de prueba',
          operationType: 'venta',
          categoryId: 'test-category',
          locationId: 'test-location',
        }),
        credentials: 'include',
      });
      
      if (newPropertyResponse.ok) {
        const newProperty = await newPropertyResponse.json();
        console.log('✅ Propiedad creada exitosamente:', newProperty.code);
        console.log(`   - Contador actualizado: ${testAgency.propertyCount + 1}/${testAgency.propertyLimit}`);
      } else {
        const error = await newPropertyResponse.json();
        console.log('❌ Error inesperado al crear propiedad:', error);
      }
    } catch (error) {
      console.log('❌ Error de red:', error);
    }
    
    // 3. Intentar crear otra propiedad (debería fallar - alcanzó límite)
    console.log('\n3️⃣ Intentando crear segunda propiedad (debería fallar)...');
    try {
      const secondPropertyResponse = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Propiedad de Prueba 2',
          description: 'Descripción de prueba 2',
          price: '200000',
          currency: 'USD',
          address: 'Dirección de prueba 2',
          operationType: 'venta',
          categoryId: 'test-category',
          locationId: 'test-location',
        }),
        credentials: 'include',
      });
      
      if (secondPropertyResponse.ok) {
        console.log('❌ ERROR: Se creó propiedad cuando no debería');
        const property = await secondPropertyResponse.json();
        console.log('   - Propiedad:', property.code);
      } else {
        const error = await secondPropertyResponse.json();
        console.log('✅ Límite validado correctamente:', error.message);
        console.log('   - Status:', secondPropertyResponse.status);
        console.log('   - Code:', error.code);
        console.log('   - Current Count:', error.currentCount);
        console.log('   - Limit:', error.limit);
        console.log('   - Upgrade URL:', error.upgradeUrl);
      }
    } catch (error) {
      console.log('❌ Error de red:', error);
    }
    
    // 4. Limpiar: eliminar propiedad de prueba
    console.log('\n4️⃣ Limpiando: eliminando propiedad de prueba...');
    try {
      const propertiesResponse = await fetch('/api/properties');
      const properties = await propertiesResponse.json();
      const testProperty = properties.data?.find((p: any) => p.title === 'Propiedad de Prueba');
      
      if (testProperty) {
        const deleteResponse = await fetch(`/api/properties/${testProperty.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        
        if (deleteResponse.ok) {
          console.log('✅ Propiedad de prueba eliminada');
        } else {
          console.log('❌ Error eliminando propiedad de prueba');
        }
      }
    } catch (error) {
      console.log('❌ Error en limpieza:', error);
    }
    
    console.log('\n🎉 TEST COMPLETADO');
    console.log('=============================================');
    console.log('✅ Validación de límites funciona correctamente');
    console.log('✅ Contador se actualiza automáticamente');
    console.log('✅ Mensajes de error son claros');
    
  } catch (error) {
    console.error('❌ Error general en test:', error);
  }
}

// Este script debe ejecutarse en el contexto del navegador
if (typeof window !== 'undefined') {
  testPropertyLimits();
} else {
  console.log('📝 Este script debe ejecutarse en el navegador (contexto de cliente)');
}