/* LeetCode Problem `Customer Who Visited but Did Not Make Any Transactions`
 * https://leetcode.com/problems/customer-who-visited-but-did-not-make-any-transactions/description/?envType=study-plan-v2&envId=top-sql-50
*/

SELECT v.customer_id, COUNT(v.customer_id) as count_no_trans 
FROM visits v
LEFT JOIN transactions t 
ON v.visit_id = t.visit_id
WHERE t.transaction_id IS NULL
GROUP BY v.customer_id;