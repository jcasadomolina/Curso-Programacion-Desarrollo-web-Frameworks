package com.reto4.hibernate;
import com.reto4.hibernate.service.BookService;
import jakarta.persistence.EntityManagerFactory;
import org.hibernate.SessionFactory;
import org.hibernate.stat.Statistics;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@SpringBootApplication
public class HibernateApplication {

    public static void main(String[] args) {
        SpringApplication.run(HibernateApplication.class, args);
    }

    @Bean
    public CommandLineRunner runData(BookService bookService, EntityManagerFactory entityManagerFactory) {
        return args -> {
            System.out.println(">>> INICIANDO CARGA DE BASE DE DATOS <<<");
            bookService.loadDatabase();
            
            System.out.println(">>> INICIANDO PROCESAMIENTO DE CONSULTAS <<<");
            bookService.processBooksAndAuthors();
            
            System.out.println(">>> PROCESO FINALIZADO <<<");
            writePerformanceReport(entityManagerFactory);
        };
    }

    private void writePerformanceReport(EntityManagerFactory entityManagerFactory) throws IOException {
        Statistics statistics = entityManagerFactory.unwrap(SessionFactory.class).getStatistics();
        Path reportPath = Path.of("target", "hibernate-performance-optimized.md");
        Files.createDirectories(reportPath.getParent());

        String report = """
                # Informe de rendimiento de Hibernate

                ## Estadisticas de persistencia

                | Metrica | Valor |
                | --- | ---: |
                | Entidades insertadas | %d |
                | Entidades actualizadas | %d |
                | Entidades eliminadas | %d |
                | Entidades cargadas | %d |
                | Entidades recuperadas | %d |
                | Consultas ejecutadas | %d |
                | Sentencias preparadas | %d |
                | Transacciones | %d |
                | Tiempo maximo de consulta (ms) | %d |

                El detalle de las sentencias SQL y sus parametros esta en
                `target/hibernate-performance.log`.
                """.formatted(
                statistics.getEntityInsertCount(),
                statistics.getEntityUpdateCount(),
                statistics.getEntityDeleteCount(),
                statistics.getEntityLoadCount(),
                statistics.getEntityFetchCount(),
                statistics.getQueryExecutionCount(),
                statistics.getPrepareStatementCount(),
                statistics.getTransactionCount(),
                statistics.getQueryExecutionMaxTime());

        Files.writeString(reportPath, report);
        System.out.println(">>> INFORME GENERADO: " + reportPath + " <<<");
    }
}
